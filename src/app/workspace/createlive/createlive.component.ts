import { Component, OnInit } from '@angular/core';
import { pageAnimation, tagAnimation } from '../../common/public-data';


@Component({
  selector: 'app-createlive',
  templateUrl: './createlive.component.html',
  styleUrls: ['./createlive.component.css'],
  animations: [
    pageAnimation,
    tagAnimation
  ]
})
export class CreateliveComponent implements OnInit {
  
  liveName:string;
  liveType:string;
  liveTime:string;
  liveContent:string;
  livefile = new Array<any>();

  constructor() { }

  ngOnInit() {
  }

}
