import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./shared/components/layout/layout.component";
import {AuthForwardGuard} from "./core/auth/auth-forward.guard";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', loadChildren: () => import('./views/main/main.module').then(m => m.MainModule)},
      {path: 'blog', loadChildren: () => import('./views/blog/blog.module').then(m => m.BlogModule)},
      {path: 'auth', loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule), canActivate: [AuthForwardGuard]},
    ]
  },
  {path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled',})],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
