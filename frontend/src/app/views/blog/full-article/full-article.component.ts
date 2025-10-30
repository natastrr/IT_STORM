import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ArticleType, FullArticleType} from "../../../../types/article.type";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentType} from "../../../../types/comment.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-full-article',
  templateUrl: './full-article.component.html',
  styleUrls: ['./full-article.component.scss']
})

export class FullArticleComponent implements OnInit {
  articleInfo!: FullArticleType;
  relatedArticles?: ArticleType[];
  comments: CommentType[] = [];
  commentText: string = '';
  isLoggedIn: boolean = false;
  commentLimit: number = 3; // Это по сколько комментариев за раз будет подгружаться
  commentOffset: number = 0;
  commentTotalCount: number = 0;

  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap): void => {
      const articleUrl: string | null = params.get('url');
      if (articleUrl) {
        this.loadArticle(articleUrl);
      } else {
        this.router.navigate(['/blog']).then((): void => {
          this._snackBar.open('Некорректный адрес статьи!');
        });
      }
    });
    this.isLoggedIn = this.authService.getIsLoggedIn();
  }

  private loadArticle(url: string): void {
    this.http.get<FullArticleType>(environment.api + 'articles/' + url).subscribe({
      next: (articleInfo: FullArticleType): void => {
        this.articleInfo = articleInfo;
        this.articleInfo.text = this.transformUrlsToLinks(this.articleInfo.text);
        this.getComments(articleInfo.id);
      },
      error: (errorResponse: HttpErrorResponse): void => {
        console.log(errorResponse.error);
        this.router.navigate(['/blog']).then((): void => {
          this._snackBar.open('Ошибка при получении данных статьи!');
        });
      }
    });
    this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url).subscribe({
      next: (data: ArticleType[]): void => {
        this.relatedArticles = data;
      },
      error: (errorResponse: HttpErrorResponse): void => {
        console.log(errorResponse.error);
        this._snackBar.open('Ошибка при получении данных статьи!');
      }
    });
  }

  private getComments(articleId: string): void {
    this.http.get<{
      allCount: number,
      comments: CommentType[]
    }>(environment.api + 'comments?offset=' + this.commentOffset + '&article=' + articleId).subscribe({
      next: (commentsData: { allCount: number, comments: CommentType[] }): void => {
        this.comments = [...this.comments, ...commentsData.comments.slice(0, this.commentLimit)];
        this.commentOffset += this.commentLimit;
        if (this.authService.getIsLoggedIn()) {
          commentsData.comments.forEach((comment: CommentType): void => this.getUserCommentAction(comment.id));
        }
        if (this.commentTotalCount === 0) this.commentTotalCount = commentsData.allCount;
      },
      error: (errorResponse: HttpErrorResponse): void => {
        console.log(errorResponse.error);
        this._snackBar.open('Ошибка при получении комментариев!');
      }
    });
  }

  getMoreComments(): void {
    if (this.comments.length < this.commentTotalCount) this.getComments(this.articleInfo.id);
  }

  private getUserCommentAction(commentId: string): void {
    const comment: CommentType | undefined = this.comments.find((comment: CommentType): boolean => comment.id === commentId);
    if (!comment) return;

    this.http.get<{
      comment: string,
      action: 'like' | 'dislike'
    }[] | DefaultResponseType>(environment.api + 'comments/' + commentId + '/actions')
      .subscribe({
        next: (response: { comment: string, action: 'like' | 'dislike' }[] | DefaultResponseType): void => {
          if (!Array.isArray(response)) {
            comment.userAction = null;
            return;
          }
          comment.userAction = response.length ? response[0].action : null;
        },
        error: (errorResponse: HttpErrorResponse): void => {
          comment.userAction = null;
          console.log('Ошибка при получении действия пользователя:', errorResponse.error.message);
        }
      });
  }

  reactToComment(comment: CommentType, action: 'like' | 'dislike'): void {
    if (this.authService.getIsLoggedIn()) {
      this.http.post<DefaultResponseType>(environment.api + 'comments/' + comment.id + '/apply-action', {action: action}).subscribe({
        next: (response: DefaultResponseType): void => {
          if (!response.error) {
            if (comment.userAction === action) {
              comment.userAction = null;
              if (action === 'like') comment.likesCount--;
              if (action === 'dislike') comment.dislikesCount--;
            } else {
              if (comment.userAction === 'like') comment.likesCount--;
              if (comment.userAction === 'dislike') comment.dislikesCount--;
              comment.userAction = action;
              if (action === 'like') comment.likesCount++;
              if (action === 'dislike') comment.dislikesCount++;
            }
          } else {
            this._snackBar.open('Ошибка при отправке реакции!');
          }
        },
        error: (errorResponse: HttpErrorResponse): void => {
          this._snackBar.open(errorResponse.error.error && errorResponse.error.message ? errorResponse.error.message : 'Ошибка при отправке реакции!');
        }
      });
    } else {
      this._snackBar.open('Авторизируйтесь, чтобы поставить реакцию!');
    }
  }

  reportComment(comment: CommentType): void {
    if (this.authService.getIsLoggedIn()) {
      this.http.post<DefaultResponseType>(environment.api + 'comments/' + comment.id + '/apply-action', {
        action: 'violate',
      }).subscribe({
        next: (response: DefaultResponseType): void => {
          this._snackBar.open(!response.error ? 'Жалоба отправлена!' : 'Жалоба уже отправлена!');
        },
        error: (errorResponse: HttpErrorResponse): void => {
          this._snackBar.open(errorResponse.error.error && errorResponse.error.message ? 'Жалоба уже отправлена!' : 'Ошибка при отправке жалобы!');
        }
      });
    } else {
      this._snackBar.open('Авторизируйтесь, чтобы отправить жалобу на комментарий!');
    }
  }

  createComment(commentText: string, articleId: string): void {
    this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text: commentText,
      article: articleId,
    }).subscribe({
      next: (response: DefaultResponseType): void => {
        this._snackBar.open(response.message);
        if (!response.error) {
          this.commentText = '';
          this.commentOffset = 0;
          this.commentTotalCount = 0;
          this.comments = [];
          this.getComments(articleId);
        }
      },
      error: (errorResponse: HttpErrorResponse): void => {
        console.log(errorResponse.error);
        this._snackBar.open('Ошибка при отправке комментария!');
      }
    });
  }

  private transformUrlsToLinks(html: string): string {
    return html.replace(/<h3>(.*?)\s(https?:\/\/[^\s<]+)<\/h3>/g, (_match, text, url) => {
      const linkText = text.split(' ').slice(1).join(' ') || text;
      return `<h3>${text.replace(linkText, '')} <a href="${url}" target="_blank">${linkText}</a></h3>`;
    });
  }

}
