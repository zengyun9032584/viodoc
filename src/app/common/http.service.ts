import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient,HttpErrorResponse,HttpHeaders,HttpParams } from '@angular/common/http'

import { Headers, RequestOptions } from '@angular/http';
import {sha256 }from 'js-sha256';
import { environment } from '../../environments/environment';
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
// 遇到错误自动请求
import 'rxjs/add/operator/retry';
import { encode } from '@angular/router/src/url_tree';
import { escape } from 'querystring';
import { error } from 'util';

@Injectable()
export class HttpService {
    token:any;
    userId:any;
    nodelist =new Array<any>()

  constructor(private http: Http,private httpClient: HttpClient) {
    this.http = http;
   }

   getServerIP() {
    console.log(environment.serviceUrl)
    return environment.serviceUrl;
    // return  'http://192.168.1.202:9500/'
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
    const data= await this.http.put(url, json, options)
    return data.toPromise();
}

request(url,config){
    let headers = new Headers(Object.assign({
        // 'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json, text/plain, */*'
      }, config && config.headers))
      // headers.append('UserId', 'shopid=12312')
      let reqInit = {
        headers: headers,
        method: config.method || 'POST',
        body: config.body || ''
      }
  
    //   const reqUrl = `${url.includes('http') ? url : this.baseUrl + url}`
    return this.http.request(url, reqInit)
                    .toPromise()
                    .then(response=>response)
                    .catch(this.handleError)

}


ag5get(url:any){

  this.httpClient
  //{observe:'response'},
  //{ responseType : 'text'}
  .get<any>(url,{})
// 请求失败 重复请求
  .retry(3)
  .subscribe(
    resp=>{},
    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log('An error occurred:', err.error.message);
      }else{
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      }
    },
  )
}

ag5post(url:any,body:any){

  // const body={}
  const headers = new HttpHeaders().set('','');
  const params = new HttpParams().set('','')
  const option={
    headers:headers,
    params:params,
    
  }
  this.httpClient
  .post('/api/items/add', body, option)
  .subscribe();
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
   
    let headers = new Headers(Object.assign({
        // 'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json, text/plain, */*'
      }, jsonBody && jsonBody.headers))
    // let headers = new Headers({ 'Accept': 'application/json, text/plain, */*'});
    // let headers = new Headers({'Content-Type': false});
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
    let errMsg: string;
    if (error.status == 0) {
      errMsg = `亲~~ 请求未执行,1:服务未启动接口2:api地址错误|error`;
    } else if (error._body.substring(0, 1) == '{') {
      const err = JSON.parse(error._body).defaultMessage || '未知错误';
      if (error.status >= 500) {
        errMsg = `${error.status} ${error.statusText} ${err}|warn`;
      } else if (error.status == 403) {
        errMsg = `${error.status} ${error.statusText} ${err}|info`;
      } else {
        errMsg = `${error.status} ${error.statusText} ${err}|error`;
      }
    } else {
      if (error.status >= 500) {
        errMsg = `${error.status} ${error.statusText} 服务器超时|warn`;
      } else {
        errMsg = `${error.status} ${error.statusText} 服务器错误|error`;
      }
    }

    return Promise.reject(errMsg);
}

makeBodyHeader (params = {}) {
    this.token = this.storeget('ffys_user_token') || null
    this.userId = this.storeget('ffys_user_info') && this.storeget('ffys_user_info').userId || null
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
    // const info= encodeURI(JSON.stringify(value))
    // var expire;
    // var path = "; path=/"
    // var domain = "; domain=localhost"
    // expire = new Date ((new Date ()).getTime () + 12 * 3600000);
    // expire = "; expires=" + expire.toGMTString ();
    // document.cookie = key + "=" + info + expire + path + domain;
    localStorage.setItem(key, value)
    return this
    
}
getcookie(){
  try{
    console.log(document.cookie)
    const cookie = document.cookie;
    // const cookie = "ffys_user_info=%7B%22headImgPath%22:%22http://viodoc.tpddns.cn:18080/viodoc/M00/00/14/wKgBylovRRyAGm_7AABzWSVMFLs724.jpg%22,%22name%22:%22%E6%99%A8%E9%80%B8%22,%22nickname%22:%22%22,%22gender%22:0,%22tags%22:%5B%5D,%22userId%22:522,%22other_user_id%22:0,%22relationship%22:0,%22follow_type%22:0,%22userKind%22:1,%22accountName%22:%2218641107703%22%7D; ffys_user_token=%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDQ2Nzc2MzUsInN1YiI6IjIwYSJ9.IwEAw908IgXZ70By-6_P_Jgsnt6tscdtooAPjF7O7AQ%22"
    var cookielist = cookie.split(";");
    for (let i=0;i<cookielist.length;i++){
      if(cookielist[i].split("=")[0].indexOf("ffys_user_info")>-1){
        var data=cookielist[i].split("=")[1];
        var userinfo = decodeURI(data)
        this.storeset("ffys_user_info",userinfo)
        break
      }   
    }
    
    for (let i=0;i<cookielist.length;i++){
      if(cookielist[i].split("=")[0].indexOf("ffys_user_token") >-1){
        var data=cookielist[i].split("=")[1];
        var usertoken = decodeURI(data)
        this.storeset("ffys_user_token",usertoken)
        break
      }   
    }
  }catch(error){
    return false
  }


}


storeget(key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch (e) {
      false
    }

}

storeremove (key) {
    localStorage.removeItem(key)
    return this
  }

  traverse(e: any[], file:any ,list) {
    // this.nodelist =[]
    if(e.length){
      for (let i = 0; i < e.length; i++) {
        if ( e[i].label.indexOf(file)>-1 ){
          list.push(e[i])
        }
        if(e[i].children){
          this.traverse(e[i].children, file,list)
        }else{

        }
      }
    }
  
    return list 
}


}
