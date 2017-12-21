import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppComponent } from './app.component';
import { HttpService } from './common/http.service';
import { FuzzySearchPipe } from './common/fuzzy-search.pipe'

import {appRoutes} from './app.routes';
import {Preload} from './preloading';
import {WorkspaceService} from './workspace/workspace.service';
import { LoginComponent } from './login/login.component';

import {ChipsModule, PasswordModule,ButtonModule} from 'primeng/primeng';
import {NoopInterceptor } from './common/http.interceptor'
import {TreeModule} from 'primeng/primeng';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
   
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule,

    TreeModule,
    RouterModule.forRoot(
      appRoutes,
      { preloadingStrategy: Preload }
    ),

    ChipsModule,         //输入框
    PasswordModule,       //密码输入
    ButtonModule,         // 按钮
    
  ],
  providers: [
    FuzzySearchPipe,
    HttpService,
    WorkspaceService,
    Preload,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS,useClass: NoopInterceptor,multi: true,}
  ],
  // exports:[
  // ],
  bootstrap: [AppComponent]
})
export class AppModule { }
