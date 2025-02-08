import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";
import {NavbarComponent} from "./components/navbar/navbar.component";


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterLink
  ],
  exports: []
})
export class SharedModule {
}
