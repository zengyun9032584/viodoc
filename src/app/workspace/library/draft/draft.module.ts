import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from "@angular/router";
import {
    GrowlModule,
    DataTableModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    DataListModule
} from 'primeng/primeng';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {DraftComponent} from "./draft.component";
import {MyBreadcrumbModule} from "../../../components/my-breadcrumb/my-breadcrumb";


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    CommonModule,
    ReactiveFormsModule,


    DataListModule,
    GrowlModule,
    DataTableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,

    MyBreadcrumbModule,
    RouterModule.forChild([
      { path:'',component:DraftComponent}
    ])
  ],
  declarations: [DraftComponent],
  exports:[RouterModule]
})
export class DraftModule { }
