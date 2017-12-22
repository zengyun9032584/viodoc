import { Component, OnInit } from '@angular/core';
import { pageAnimation, tagAnimation } from '../../../common/public-data';
import { HttpService } from '../../../common/http.service';
import { Router } from '@angular/router'
import { error } from 'selenium-webdriver';
import { parseHtmlToJson,previewHtml } from '../../../common/assist'


@Component({
  selector: 'app-collection',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.css'],
  animations: [
    pageAnimation,
    tagAnimation
  ]
})
export class DraftComponent implements OnInit {
  msgs = [];
  items: any;

  draftList = []
  realname:any
  userpic:any
  userId:any
  showdraftList = []
  constructor(private http: HttpService,private router:Router) { 
    this.checklogin()
  }

  ngOnInit() {
    this.getArticleList()
  }

  /**
 *  检查是否登录，登录信息存储在localstorage
 *
 * @stable
*/
checklogin(){
  const userinfo:any = this.http.storeget('ffys_user_info')
    if (userinfo) {
    this.realname = userinfo.name;
    this.userpic = userinfo.headImgPath;
    this.userId = userinfo.userId;
  } else {
    this.router.navigateByUrl("login");
  }
}



  async getArticleList () {
    try {
      const res:any = await this.getDraftArticleList()
      this.showdraftList = JSON.parse(res._body).articleList
      this.draftList = JSON.parse(res._body).articleList
    } catch (error) {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: '获取文章草稿失败', detail: `${error}` });
    }
  }

//搜索文章
  searchActicle(e:any){
    var searchdata=[]
    debugger
    if(e.keyCode ===13){
      this.draftList.forEach((pre,index)=>{
        if(pre.title.indexOf(e.target.value)>-1 ){
          searchdata.push(pre)
        }
      })
      this.showdraftList = searchdata
    }
    if(e.target.value===''){
      this.showdraftList = this.draftList
    }
  
  }

  async deleteArtilce (articleID) {
    await this.deleteDraftArticle(articleID)
    .then(success => {
      const index = this.draftList.findIndex(t => t.articleID === articleID)
      this.draftList.splice(index, 1)
      this.showdraftList.splice(index,1)
      this.getArticleList()
    }).catch(error => {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: '获取文章草稿失败', detail: `${error}` });
    })
  }


    // 获取草稿列表
    getDraftArticleList () {
      return this.http.newpost('api/viodoc/getAllDraftArticleList', 
         JSON.stringify({
          header: this.http.makeBodyHeader(),
          userId: String(this.userId),
        })
      )
    }
  
    // 获取草稿详情
     getDraftDetail (articleID) {

      return this.http.newpost('api/viodoc/getArticleContent', 
         JSON.stringify({
          header: this.http.makeBodyHeader(),
          articleID: Number(articleID)
        })
      )
    }
    async titleClick (articleID) {
      try {
        const articleDetail:any = await this.getDraftDetail(articleID)
        const a = JSON.parse(articleDetail._body).articleDetail
        this.getPrewviewHtml(a)
  
      } catch (error) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '获取文章草稿失败', detail: `${error}` });
      }
    }

    async editDraft(articleID){
      try {
       
        this.router.navigate(['workspace/article',articleID])
      } catch (error) {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '获取文章草稿失败', detail: `${error}` });
      }
    }
 // 删除草稿
 deleteDraftArticle (articleID) {
  return this.http.newpost('api/viodoc/deleteDraftArticle', 
     JSON.stringify({
      header: this.http.makeBodyHeader(),
      userId: String(this.userId),
      articleID: Number(articleID)
    })
  )
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
      data.contentWindow.document.getElementById('authorAvatar').src = this.userpic;
      data.contentWindow.document.getElementById('authorName').innerText += this.realname;
      data.contentWindow.document.getElementById('jobTitle').innerText += '';
      data.contentWindow.document.getElementById('articletag').innerHTML += str;
      data.contentWindow.document.getElementById('content').innerHTML += previewHtml(JSON.parse(e.content))

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
