import {CommentType} from "./comment.type";

export interface ArticleType {
  category: string,
  date: string,
  description: string,
  id: string,
  image: string,
  title: string,
  url: string,
}

export interface FullArticleType extends ArticleType {
  comments: CommentType[],
  commentsCount: number,
  text: string,
}
