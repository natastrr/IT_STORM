import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {LoaderComponent} from './components/loader/loader.component';
import {PopupComponent} from './components/popup/popup.component';
import {MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {ArticleComponent} from "./components/article/article.component";
import {NgxMaskModule} from "ngx-mask";

@NgModule({
  declarations: [
    LoaderComponent,
    PopupComponent,
    ArticleComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    RouterModule,
  ],
  exports: [
    LoaderComponent,
    PopupComponent,
    ArticleComponent,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    NgxMaskModule,
    RouterModule,
  ],
})

export class SharedModule {
}
