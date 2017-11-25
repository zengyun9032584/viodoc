import { Component, OnInit } from '@angular/core';
import { pageAnimation, tagAnimation,LiveData } from '../../common/public-data';


const LiveList: LiveData[]=[
  { 
    title:"吹空调会面瘫么吹空调会面瘫么吹空调会面瘫么",
    name:"王玉涛",
    time:"2017年1月1日",
    status:"直播中",
    introduce:"最近有新闻说，2岁的宝宝，吹空调",
    content:"最近有新闻说，2岁的宝宝，吹空调",
    file:""
  },
  { 
    title:"吹空调会面瘫么",
    name:"王玉涛",
    time:"2017年1月1日",
    status:"直播中",
    introduce:"最近有新闻说，2岁的宝宝，吹空调",
    content:"最近有新闻说，2岁的宝宝，吹空调",
    file:""
  },
  { 
    title:"吹空调会面瘫么",
    name:"王玉涛",
    time:"2017年1月1日",
    status:"直播中",
    introduce:"最近有新闻说，2岁的宝宝，吹空调",
    content:"最近有新闻说，2岁的宝宝，吹空调",
    file:""
  },
  
]



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
  msgs = ["1","1","1","11","1","q","1"];
  livelist=LiveList
  
  constructor() { }

  ngOnInit() {
    // var  = new LiveData
    // this.livelist.title = ""
    // this.livelist.name = ""
    // this.livelist.status = ""
    // this.livelist.introduce = "
    // this.livelist.content = "最近有新闻说，2岁的宝宝，吹空调最近有新闻说，2岁的宝宝，吹空调最近有新闻说，2岁的宝宝，吹空调最近有新闻说，2岁的宝宝，吹空调"
  }

}
