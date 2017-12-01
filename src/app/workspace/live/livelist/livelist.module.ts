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
    PanelModule,
    InputTextModule,
    DataTableModule,
    SharedModule,
    CalendarModule,
    MultiSelectModule,
    DropdownModule,
    CheckboxModule,
    PaginatorModule,
    TooltipModule,
    OverlayPanelModule,
    TreeModule,
    DataListModule,
    SelectButtonModule
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
    PanelModule,
    InputTextModule,
    DataTableModule,
    DialogModule,
    SharedModule,
    CalendarModule,
    GrowlModule,
    MultiSelectModule,
    DropdownModule,
    CheckboxModule,
    PaginatorModule,
    TooltipModule,
    OverlayPanelModule,
    MyBreadcrumbModule,
    TreeModule,
    DataListModule,
    SelectButtonModule,

    RouterModule.forChild([
      { path:'',component:LivelistComponent}
    ])
  ],
  declarations: [LivelistComponent],
  exports:[RouterModule]
})
export class LivelistModule { }
