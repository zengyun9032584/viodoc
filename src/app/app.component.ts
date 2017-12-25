import { Component, OnInit } from '@angular/core';
import { HttpService } from './common/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

      constructor( private http: HttpService) {
        // this.http.getcookie()
      };

      ngOnInit() {
      }
}
