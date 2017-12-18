import { Injectable } from '@angular/core'
import {HttpEvent, HttpInterceptor,HttpHandler,HttpRequest } from '@angular/common/http'

import {Observable} from 'rxjs/Observable';

@Injectable ()

export class NoopInterceptor implements HttpInterceptor{

    intercept(rep: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        debugger
        return next.handle(rep);
    }

}