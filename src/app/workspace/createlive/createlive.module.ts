import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {CreateliveComponent} from "./createlive.component";

import {
    GrowlModule,
  } from 'primeng/primeng';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    CommonModule,
    ReactiveFormsModule,

    GrowlModule,

    RouterModule.forChild([
      { path:'',component:CreateliveComponent}
    ])
  ],
  declarations: [CreateliveComponent],
  exports:[RouterModule]
})
export class CreateliveModule { }
