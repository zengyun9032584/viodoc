import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from "@angular/router";
import {
  GrowlModule,
  DataListModule,
  ButtonModule,
  InputTextModule,
} from 'primeng/primeng';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {ArticleListComponent} from "./article-list.component";
import {MyBreadcrumbModule} from "../../../components/my-breadcrumb/my-breadcrumb";


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    CommonModule,
    ReactiveFormsModule,
    
    InputTextModule,
    ButtonModule,
    GrowlModule,
    DataListModule,
    MyBreadcrumbModule,
    RouterModule.forChild([
      { path:'',component:ArticleListComponent}
    ])
  ],
  declarations: [ArticleListComponent],
  exports:[RouterModule]
})
export class ArticleListModule { }
