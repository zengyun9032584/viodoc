import { Component, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { pageAnimation, tagAnimation, LiveData,TreeNode } from '../common/public-data';

@Component({
  selector: 'app-treedemo',
  templateUrl: './treedemo.component.html',
  styleUrls: ['./treedemo.component.css']
})


export class TreedemoComponent implements OnInit {

  treeUrl = 'assets/data/tree.json';
  treedata: any[];
  msg:string;                                    //菜单

  tree:any[];
  files: TreeNode[];
  selectedFiles: TreeNode[];

 
  constructor(private httpservice: HttpService,private myService: WorkspaceService, ) {}
  
  ngOnInit() {
    this.gettree()
    debugger
  }


  gettree(){
    debugger
    this.myService.getMenu(this.treeUrl)
    .then(
      menus => {
        debugger
        var a :any
        a = menus
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

  nodeSelect(event:any) {
    //event.node = selected node
  }
  onNodeUnselect(e:any){
  }


  async getIllTag(){
    try{
      // this.files = new Array<TreeNode>();
      this.tree = await this.getsubjectlist(0)
      this.traverse(this.tree,this.files)
    }catch(error){
      alert(error)
    }
  }

  async traverse(e:any[],file:TreeNode[]){
    for(let i=0;i<e.length;i++){
      var data=new TreeNode()
      data.label=e[i].nodeName
      data.data=e[i].nodeId
      data.children = new Array<TreeNode>();
      e[i].chilren = await this.getsubjectlist(e[i].nodeId)
      debugger
      file[i] = data    
      if(e[i].chilren.length>0){
        this.traverse(e[i].chilren,file[i].children)
      } else{
        break
      }
    }
  }
  
  async getsubjectlist(id:any){
    const json={
      header:this.httpservice.makeBodyHeader({}, false),
      parentId: new Number(id)
    }
    try{
    const data: any =await this.httpservice.newpost('api/viodoc/getSubjectTreeNode',JSON.stringify(json))
    var a = JSON.parse(data._body)
    var tree = a.subjectNode;
    // console.log(this.tree)
    return tree
    } catch(error){

    }
  }


}

