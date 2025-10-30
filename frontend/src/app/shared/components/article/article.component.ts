import {Component, Input} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";

@Component({
  selector: 'article-component',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent {

  @Input() article!: ArticleType;
  constructor() {}

}
