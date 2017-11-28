import { Component, OnInit } from '@angular/core';
import { pageAnimation, tagAnimation } from '../../../common/public-data';

@Component({
  selector: 'article-list',
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
