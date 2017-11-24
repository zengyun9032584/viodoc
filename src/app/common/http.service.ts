import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

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
  constructor(private http: Http) {
    this.http = http;
   }

   getServerIP() {
       return 'http://viodoc.tpddns.cn:9500/';
    //    return `http://localhost:3000`;
   }

async newget(url: string) {
    console.log('HTTP GET '+url);
    let options = new RequestOptions({ withCredentials:false });
    const data = await this.http.get(url,options) // 这里得到了一个返回错误
    return data.toPromise();
};

async newpost(url: string,json:any){
    console.log("http POST"+url)
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({ headers: headers,withCredentials:false });
    const data = await this.http.post(url,json,options) // 这里得到了一个返回错误
    return data.toPromise();
}
async newput(url:string,json:any){
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
    // let headers = new Headers({'Content-Type': 'application/json'});
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

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
}
