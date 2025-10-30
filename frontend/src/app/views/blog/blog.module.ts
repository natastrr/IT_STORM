import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BlogRoutingModule} from './blog-routing.module';
import {SharedModule} from "../../shared/shared.module";
import {FullArticleComponent} from './full-article/full-article.component';
import {BlogComponent} from "./blog/blog.component";
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    BlogComponent,
    FullArticleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BlogRoutingModule,
    SharedModule
  ]
})

export class BlogModule {
}
