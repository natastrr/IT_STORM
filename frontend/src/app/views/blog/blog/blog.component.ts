import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ArticleType} from "../../../../types/article.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CategoryType} from "../../../../types/category.type";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  isFilterOpen: boolean = false;
  categories: CategoryType[] = [];
  articles: ArticleType[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.http.get<CategoryType[] | DefaultResponseType>(environment.api + 'categories').subscribe({
      next: (categoriesData: CategoryType[] | DefaultResponseType): void => {
        if ((categoriesData as DefaultResponseType).error) {
          console.log((categoriesData as DefaultResponseType).message);
          this.router.navigate(['/']).then((): void => {
            this._snackBar.open('Ошибка при загрузке категорий.')
          });
          return;
        }
        this.categories = categoriesData as CategoryType[];
        this.route.queryParamMap.subscribe((params: ParamMap): void => {
          const activeCategories: string[] = params.getAll('categories');
          this.categories.forEach((category: CategoryType): void => {
            category.active = activeCategories.includes(category.url);
          });
          const pageParam: string | null = params.get('page');
          this.currentPage = pageParam ? +pageParam : 1;
        });
        this.loadArticles();
      },
      error: (errorResponse: HttpErrorResponse): void => {
        console.log(errorResponse.error.message);
        this.router.navigate(['/']).then((): void => {
          this._snackBar.open('Ошибка при загрузке категорий.')
        });
      }
    });
  }

  private loadArticles(): void {
    const activeCategories: string[] = this.categories
      .filter((category: CategoryType): boolean | undefined => category.active)
      .map((category: CategoryType): string => category.url);
    const params: any = {page: this.currentPage};
    if (activeCategories.length) params.categories = activeCategories;

    this.http.get<DefaultResponseType | {count: number, pages: number, items: ArticleType[]}>(environment.api + 'articles', { params }).subscribe({
      next: (articlesData: DefaultResponseType | {count: number, pages: number, items: ArticleType[]}): void => {
        if ((articlesData as DefaultResponseType).error) {
          console.log((articlesData as DefaultResponseType).message);
          this.router.navigate(['/']).then((): void => {
            this._snackBar.open('Ошибка при загрузке статей!');
          });
          return;
        }
        const data: {count: number, pages: number, items: ArticleType[]} = articlesData as {count: number, pages: number, items: ArticleType[]};
        this.articles = data.items;
        this.totalPages = data.pages;
      },
      error: (errorResponse: HttpErrorResponse): void => {
        console.log(errorResponse.error.message);
        this.router.navigate(['/']).then((): void => {
          this._snackBar.open('Ошибка при загрузке статей!');
        });
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    }).then((): void => this.loadArticles());
  }

  selectFilterCategory(category: CategoryType): void {
    category.active = !category.active;

    const activeCategories: string[] = this.categories
      .filter((category: CategoryType): boolean | undefined => category.active)
      .map((category: CategoryType): string => category.url);

    const queryParams: {[key: string]: string | string[] | null } = {};
    if (activeCategories.length) queryParams['categories'] = activeCategories;
    this.currentPage = 1; queryParams['page'] = '1';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    }).then();

    this.loadArticles();
  }

  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target: HTMLElement = event.target as HTMLElement;
    if (!target.closest('.filter')) this.isFilterOpen = false;
  }

}
