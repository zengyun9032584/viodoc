import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {LivelistComponent} from "./livelist.component";

import {
    GrowlModule,
    ButtonModule,         // 按钮
    DialogModule,
    
  } from 'primeng/primeng';

  import {MyBreadcrumbModule} from "../../../components/my-breadcrumb/my-breadcrumb";


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    CommonModule,
    ReactiveFormsModule,

    ButtonModule,         // 按钮
    
    GrowlModule,
    MyBreadcrumbModule,
    DialogModule,

    RouterModule.forChild([
      { path:'',component:LivelistComponent}
    ])
  ],
  declarations: [LivelistComponent],
  exports:[RouterModule]
})
export class LivelistModule { }
