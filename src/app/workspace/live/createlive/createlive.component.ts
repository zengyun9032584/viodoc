import { ViewChild, Component, OnInit } from '@angular/core';
import { pageAnimation, tagAnimation, LiveData, TreeNode } from '../../../common/public-data';
// import {TreeNode} from 'primeng/primeng';
import { HttpService } from '../../../common/http.service';
import { WorkspaceService } from '../../../workspace/workspace.service';
import { NgModule } from '@angular/core/src/metadata/ng_module';

// import { TreedemoComponent } from '../../../treedemo/treedemo.component';

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

  liveinfo: LiveData;
  livetiele: string;
  livename: string;
  livetype: string;
  livetime: string;
  livecontent: string;
  treeUrl = 'assets/data/tree.json';
  treedata: any[];
  msgs: any;
  msg:any;

  files = new Array<TreeNode>();
  selectedFiles= new Array<TreeNode>();
  tree: any[];
  tagtree=false;

  date7:any;
  
  constructor(private httpservice: HttpService, private myService: WorkspaceService, ) {
    // this.getIllTag();
    this.gettree()
  }

  ngOnInit() {
    
  }

  async getIllTag() {
    try {
      this.tree = await this.getsubjectlist(0)
      this.traverse(this.tree, this.files)
    } catch (error) {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: '获取标签列表失败', detail: `${error}` });
    }
  }

  async traverse(e: any[], file: TreeNode[]) {
    for (let i = 0; i < e.length; i++) {
      var data = new TreeNode()
      data.label = e[i].nodeName
      data.data = e[i].nodeId
      data.children = new Array<TreeNode>();
      e[i].chilren = await this.getsubjectlist(e[i].nodeId)
      file[i] = data
      if (e[i].chilren.length > 0) {
        this.traverse(e[i].chilren, file[i].children)
      } else {
        break
      }
    }
  }

  async getsubjectlist(id: any) {
    const json = {
      header: this.httpservice.makeBodyHeader({}, false),
      parentId: new Number(id)
    }
    try {
      const data: any = await this.httpservice.newpost('api/viodoc/getSubjectTreeNode', JSON.stringify(json))
      var a = JSON.parse(data._body)
      var tree = a.subjectNode;
      return tree
    } catch (error) {

    }
  }

  
/**
 *  检查是否登录，登录信息存储在localstorage
 *
 * @stable
*/
  showtagtree(){
    this.tagtree = !this.tagtree;
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


  // async getsubjectall() {
  //   const json = {
  //     header: this.httpservice.makeBodyHeader({}, false)
  //   }
  //   try {
  //     const data: any = await this.httpservice.newpost('api/viodoc/getSubjectList', JSON.stringify(json))
  //     var a = JSON.parse(data._body)
  //     var tree = a.subjects;
  //     debugger
  //     return tree
  //   } catch (error) {

  //   }
  // }


  gettree(){
    this.myService.getMenu(this.treeUrl)
    .then(
      menus => {
        const a:any = menus
        this.files= a.data
      },
      error => {
        this.msg = '获取树文件失败,请刷新再试'
      }
    )
    .then(() => {
      if (this.files) {
        sessionStorage.setItem('menu111', JSON.stringify(this.files));
      }
    });
  }


}
