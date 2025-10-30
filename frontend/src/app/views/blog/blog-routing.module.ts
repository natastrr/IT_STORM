import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BlogComponent} from "./blog/blog.component";
import {FullArticleComponent} from "./full-article/full-article.component";

const routes: Routes = [
  {path: '', component: BlogComponent},
  {path: ':url', component: FullArticleComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {
}
