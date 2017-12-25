import { Component, OnInit } from '@angular/core';
import { pageAnimation, tagAnimation } from '../../../common/public-data';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router';

import { HttpService } from '../../../common/http.service'
import { WorkspaceService } from '../../workspace.service';
import { parseHtmlToJson,previewHtml } from '../../../common/assist'

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


  realname: string = '未登录'; 
  userpic:string;
  userId:any;

  size=20
  currentPage= 1

  articleList=[]
  showArticle = []
  selectedType="list"
  
  constructor(private httpservice:HttpService,
              public router: Router,
              private myService: WorkspaceService) {
                this.checklogin();
               
               }

  ngOnInit() {
    this. getArticleList()
  }

/**
 *  检查是否登录，登录信息存储在localstorage
 *
 * @stable
*/
  checklogin(){
    const userinfo:any = this.httpservice.storeget('ffys_user_info')
      if (userinfo) {
      this.realname = userinfo.name;
      this.userpic = userinfo.headImgPath;
      this.userId = userinfo.userId;
    } else {
      this.router.navigateByUrl("login");
    }
  }


/**
 *  获取发布文章列表
 *
 * @stable
*/
  async getArticleList () {
    try {
        var res:any = await this.httpservice.newpost('api/viodoc/getAllPublishedArticleList', 
        JSON.stringify({
            header: this.httpservice.makeBodyHeader({}),
            userID: String(this.userId),
          })
      )
      this.articleList = JSON.parse(res._body).articleList
      this.showArticle = JSON.parse(res._body).articleList
    } catch (error) {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: '获取文章列表失败', detail: `${error}` });
      return 0
    }
  }

  searchActicle(e:any){
    var searchdata=[]
    if(e.keyCode ===13){
      this.articleList.forEach((pre,index)=>{
       
        if(pre.title.indexOf(e.target.value)>-1 
        || pre.authorName.indexOf(e.target.value)>-1
        || pre.jobTitle.indexOf(e.target.value)>-1 ){
          searchdata.push(pre)
        }
      })
      this.showArticle = searchdata
    }
    if(e.target.value===''){
      this.showArticle = this.articleList
    }
  
  }

/**
 *  获取发布文章详情
 *
 * @stable
*/
     // 获取已发布文章详情
  async getPublishedArticleContent (articleID) {
    try{
      const res:any = await  this.httpservice.newpost('api/viodoc/getPublishedArticleContent',
        JSON.stringify({
          header: this.httpservice.makeBodyHeader(),
          articleID: Number(articleID)
        })
      )
      const a = JSON.parse(res._body).articleDetail
      this.getPrewviewHtml(a)
    } catch(err){
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: '获取文章详情失败', detail: `${err}` });
    }

  }

  // 删除已发布文章
  async deleteArticle (articleID) {
    try{
      await this.httpservice.newpost('api/viodoc/deleteArticle', 
        JSON.stringify({
          header: this.httpservice.makeBodyHeader(),
          userId: String(this.userId),
          articleID: Number(articleID)
        })
      )
      this.getArticleList()
    } catch(err){
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: '获取文章列表失败', detail: `${err}` });
    }
  }

  /**
     *  get preview html
     *
     * @stable
    */
    getPrewviewHtml(e:any) {
      var data: any = document.getElementById('preview-html')
      data.contentWindow.document.getElementById('title').innerText = e.title
      var str = '';
      for (let i = 0; i <e.tag.length; i++) {
          str += `<span>${e.tag[i]}</span>`
      }
      data.contentWindow.document.getElementById('title').innerText =  e.title
      data.contentWindow.document.getElementById('authorAvatar').src = e.authorAvatarURL;
      data.contentWindow.document.getElementById('authorName').innerText += e.authorName;
      data.contentWindow.document.getElementById('jobTitle').innerText += e.jobTitle;
      data.contentWindow.document.getElementById('articletag').innerHTML += str;
      data.contentWindow.document.getElementById('content').innerHTML += previewHtml(JSON.parse(e.articleContent))

      var html: any = document.getElementsByClassName('preview-layer')
      html[0].style.display = 'block';
  }


  closePreview() {
      var html: any = document.getElementsByClassName('preview-layer')
      html[0].style.display = 'none';
      var data: any = document.getElementById('preview-html')
      data.contentWindow.document.getElementById('title').innerText = ''
      data.contentWindow.document.getElementById('authorAvatar').src = '';
      data.contentWindow.document.getElementById('authorName').innerText = '';
      data.contentWindow.document.getElementById('jobTitle').innerText = '';
      data.contentWindow.document.getElementById('articletag').innerHTML = '';
      data.contentWindow.document.getElementById('content').innerHTML = '';
  }


}
