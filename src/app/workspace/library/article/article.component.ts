import { Component, OnInit } from '@angular/core';
import { beforeUrl, China, pageAnimation, tagAnimation,TreeNode } from '../../../common/public-data';
import NProgress from 'nprogress';
import { HttpService } from '../../../common/http.service';
import { WorkspaceService } from '../../../workspace/workspace.service';

import wangEditor from 'yushk'

@Component({
    selector: 'app-data-table',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.css'],
    animations: [
        pageAnimation,
        tagAnimation
    ]
})
export class ArticleComponent implements OnInit {
    constructor(private http: HttpService, private myService: WorkspaceService,) {
        // NProgress.start();
       
    }
    msgs: any;
    selectTime = new Date();
    date: any;
    title = '码农日报-';
    items: any;
    testdate: any;
    isEmpty = '';
    display = false;
    selectedItemName: any;
    selectedItemHref: any;
    selectedItemClass: any;
    selectedItemTags: any;
    
    // editor  
    editor :any;
    articleTitle:any;
    editorContent:any;

// tree
treeUrl = 'assets/data/tree.json';
treedata: any[];
msg:any;

files = new Array<TreeNode>();
selectedFiles= new Array<TreeNode>();
tree: any[];
tagtree=false;

date7:any;
showpreview = false;

    ngOnInit() {
        var date = new Date();
        date = new Date(date.getTime()-1000*60*60*24);
        var month = date.getMonth() >= 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
        var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
        this.date = `${date.getFullYear()}${month}${day}`;

        this.createEditor()
        this.gettree()
    }
/**
 *  生成editor
 *
 * @stable
*/
    createEditor(){
        const _this=this
        var editor
        var div = document.getElementById('editor')
        editor = new wangEditor('#editormenu',div)
        editor.onchange = function() {
            debugger
        }
        editor.customConfig.zIndex = 100
        editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            // 'quote',  // 引用
            'emoticon',  // 表情
            // 'image',  // 插入图片
            'table',  // 表格
            // 'video',  // 插入视频
            // 'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
        ]
        editor.customConfig.onchange=(html)=>{
            debugger
        _this.editorContent = html
        debugger
        }
        editor.create()
        
    }
/**
 *  upload pic video
 *
 * @stable
*/
    fileInputClick (ref) {
        var node:any = document.getElementById(ref)
        node.value = ""
        node.click();
    }
    
    imgOperate(e:any){
        debugger
    }
    videoOperate(e:any){
        debugger
    }
    
/**
 *  tree
 *
 * @stable
*/
    gettree(){
        this.myService.getMenu(this.treeUrl)
        .then(
          menus => {
            const a:any = menus
            this.files= a.data
          },
          error => {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: '获取树文件失败', detail: `${error}` });
          }
        )
        .then(() => {
          if (this.files) {
            sessionStorage.setItem('menu111', JSON.stringify(this.files));
          }
        });
      }

showtagtree(){
    this.tagtree = true;
  }

  closetag(){
    this.tagtree = false
  }
  nodeSelect(event: any) {
    if(this.selectedFiles.length<3){
      for(let i=0;i<this.selectedFiles.length;i++){
        if(event.node.label===this.selectedFiles[i].label){
         return
        }
      }
      this.selectedFiles.push(event.node);
      
    }
  }

  del(event:any){
    for(let i=0;i<this.selectedFiles.length;i++){
      if(event.label===this.selectedFiles[i].label){
        this.selectedFiles.splice(i,1)
      }
    }
  }

  /**
 *  get preview html
 *
 * @stable
*/
getPrewviewHtml(){
    var data = document.getElementById('preview-html')




    var html:any = document.getElementsByClassName('preview-layer')
    html[0].style.display = 'block';
}
closePreview(){
    var html:any = document.getElementsByClassName('preview-layer')
    html[0].style.display = 'none';
}

}