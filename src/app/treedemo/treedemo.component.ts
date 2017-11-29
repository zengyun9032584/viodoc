import { Component, OnInit } from '@angular/core';
import { HttpService } from '../common/http.service';
import { WorkspaceService } from '../workspace/workspace.service';
import {TreeNode } from 'primeng/primeng'

@Component({
  selector: 'app-treedemo',
  templateUrl: './treedemo.component.html',
  styleUrls: ['./treedemo.component.css']
})


export class TreedemoComponent implements OnInit {

  treeUrl = 'assets/data/tree.json';
  treedata: any[];
  msg:string;                                    //菜单
  

  files: TreeNode[];
  
  selectedFiles: TreeNode[];

  ngOnInit() {
    this.gettree()
  }

  constructor(private httpservice: HttpService,private myService: WorkspaceService, ) {}
  
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
    debugger
  }
  onNodeUnselect(e:any){
    debugger
  }


}

