import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {CreateliveComponent} from "./createlive.component";



import {
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
    TreeModule,
    TreeNode,
  } from 'primeng/primeng';

  import {MyBreadcrumbModule} from "../../../components/my-breadcrumb/my-breadcrumb";
  import { TreedemoComponent } from '../../../treedemo/treedemo.component';
  


@NgModule({
  imports: [
    FormsModule,
    HttpModule,
    JsonpModule,
    CommonModule,
    ReactiveFormsModule,

    // TreedemoComponent, // tree demo

    
    GrowlModule,
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
    
    RouterModule.forChild([
      { path:'',component:CreateliveComponent}
    ])
  ],
  declarations: [
    CreateliveComponent,
    TreedemoComponent
  ],
  exports:[RouterModule]
})
export class CreateliveModule { }
