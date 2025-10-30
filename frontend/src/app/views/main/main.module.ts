import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainRoutingModule} from './main-routing.module';
import {CarouselModule} from "ngx-owl-carousel-o";
import {MainComponent} from "./main.component";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    CarouselModule,
    SharedModule,
    MainRoutingModule
  ]
})

export class MainModule {
}
