import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import {sha256 }from 'js-sha256';


// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map'; 

@Injectable()
export class HttpService {
    token:any;
    userId:any;

  constructor(private http: Http) {
    this.http = http;
   }

   getServerIP() {
        return 'http://viodoc.tpddns.cn:9500/';
    //    return `http://localhost:3000`;
   }

async newget(url: string) {
    url = this.getServerIP()+url;
    console.log('HTTP GET '+url);
    let options = new RequestOptions({ withCredentials:false });
    const data = await this.http.get(url,options) // 这里得到了一个返回错误
    return data.toPromise();
};

async newpost(url: string,json:any){
    url = this.getServerIP()+url;
    console.log("http POST"+url)
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({ headers: headers,withCredentials:false });
    const data = await this.http.post(url,json,options) // 这里得到了一个返回错误
    return data.toPromise();
}
async newput(url:string,json:any){
    url = this.getServerIP()+url;
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({ headers: headers,withCredentials:false });
    const data= this.http.put(url, json, options)
    return data.toPromise();
}

get(url: string): Promise<any> {
    let options = new RequestOptions({ withCredentials:false });
    return this.http.get(url,options)
                .toPromise()
                .then(response => response.json())
                //.then(response => response.text())
                .catch(this.handleError);
}

post(url: string, jsonBody: any): Promise<any> {
   
    let headers = new Headers({ 'Accept': 'application/json, text/plain, */*'});
    // let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

    let options = new RequestOptions({ headers: headers,withCredentials:false });
    return this.http.post(url, jsonBody, options)
                    .toPromise()
                    .then(response => response.json())
                    .catch(this.handleError);
}

put(url: string, jsonBody: any): Promise<any> {
    //let headers = new Headers({'Content-Type': 'application/json'});
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

    let options = new RequestOptions({ headers: headers,withCredentials:false });
    return this.http.put(url, jsonBody, options)
                    .toPromise()
                    .then(response => response.text())
                    .catch(this.handleError);
}

delete(url: string): Promise<any> {
    //let headers = new Headers({'Content-Type': 'application/json'});
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({ headers: headers,withCredentials:false });
    return this.http.delete(url, options)
                    .toPromise()
                    //.then(this.extractData)
                    .then(response => response.text())
                    .catch(this.handleError);
} 

private extractData(res: Response): Promise<any> {
    //alert("extractting" + res);
    //let body = res.json();
    let body = res.json();
    return body || { };
}

private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
}

makeBodyHeader (params = {}, needAuth = true) {
    this.token = this.storeget('ffys_user_token') || null
    this.userId = this.storeget('ffys_user_info') && this.storeget('ffys_user_info').userId || null
    if (!this.userId && needAuth) throw new Error('用户丢失,请按 F5 刷新')
    if (!this.token && needAuth) throw new Error('用户token丢失,请按 F5 刷新')
    const timeStamp = new Date().getTime()
    const nonce = this.generateUUID()
    const signature = sha256(`049ddf35f8f43f0058176da1c9c462b3fcffaa3b3822767dd28c60618e76da70${timeStamp}${nonce}`)
    const appType = 4
    // console.log(signature)
    return Object.assign(params, {
      timeStamp,
      nonce,
      signature,
      appType,
      token: this.token,
      userId: this.userId && Number(this.userId)
    })
  }

  // uuid-v4
 generateUUID = () => {
  var d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now()
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

storeset(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
    return this
}
storeget(key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch (e) {
      return
    }
}
storeremove (key) {
    localStorage.removeItem(key)
    return this
  }
}
