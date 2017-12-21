import { Component, OnInit } from '@angular/core';
import { pageAnimation, tagAnimation } from '../../../common/public-data';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router';

import { HttpService } from '../../../common/http.service'
import { WorkspaceService } from '../../workspace.service';
// import { articleList, articleData } from 'app/workspace/library/article-list/article-list.module';

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

  size=10
  total= 0
  currentPage= 1

  selectedType='list';
  articleList = new Array<any>();
  constructor(private httpservice:HttpService,
              public router: Router,
              private myService: WorkspaceService) {
                this.checklogin();
               
               }

  ngOnInit() {
    this.getArticleList();
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
      debugger
      const page = {
        pageNo: this.currentPage,
        pageSize: this.size
          }
        var res:any = await this.httpservice.newpost('api/viodoc/getPublishedArticleList', 
          JSON.stringify({
          header: this.httpservice.makeBodyHeader({}, false),
          userId: String(this.userId),
          page: page//从后台获取数据
        })
      )
      var a:any = JSON.parse(res._body)//解析从后台获取的数据
      this.articleList = a.articleList;//将获取到的数据放入自定义的数组当中
      debugger
    } catch (error) {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: '获取文章列表失败', detail: `${error}` });
    
    }
  }

/**
 *  获取发布文章详情
 *
 * @stable
*/
     // 获取已发布文章详情
  getPublishedArticleContent (articleID) {
    // let { userId } = Store.get('ffys_user_info') || {}
    // if (!userId) throw new Error('用户id丢失')
    return this.httpservice.newpost('api/viodoc/getPublishedArticleContent', {
      body: JSON.stringify({
        header: this.httpservice.makeBodyHeader(),
        articleID: Number(articleID)
      })
    })
  }

  // 删除已发布文章
  deleteArticle (articleID) {
    // let { userId } = this.httpservice.storeget('ffys_user_info') || {}
    debugger
    return this.httpservice.newpost('api/viodoc/deleteArticle', 
       JSON.stringify({
        header: this.httpservice.makeBodyHeader(),
        userId: String(this.userId),
        articleID: Number(articleID)
      })
    )
    
  }
}
