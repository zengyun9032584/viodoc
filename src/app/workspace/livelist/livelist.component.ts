import { Component, OnInit } from '@angular/core';
import { pageAnimation, tagAnimation } from '../../common/public-data';


@Component({
  selector: 'app-livelist',
  templateUrl: './livelist.component.html',
  styleUrls: ['./livelist.component.css'],
  animations: [
    pageAnimation,
    tagAnimation
  ]
})
export class LivelistComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
