import { Component, OnInit } from '@angular/core';
import { pageAnimation, tagAnimation } from '../../../common/public-data';

@Component({
  selector: 'app-template',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
  animations: [
    pageAnimation,
    tagAnimation
  ]
})
export class ArticleListComponent implements OnInit {
  msgs = [];
  constructor() { }

  ngOnInit() {
  }

}
