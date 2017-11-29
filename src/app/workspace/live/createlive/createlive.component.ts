import { ViewChild,Component, OnInit } from '@angular/core';
import { pageAnimation, tagAnimation, LiveData } from '../../../common/public-data';
import {TreeNode} from 'primeng/primeng';
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

  liveinfo:LiveData;
  livetiele:string;
  livename:string;
  livetype:string;
  livetime:string;
  livecontent:string;
  treeUrl = 'assets/data/tree.json';
  treedata: any[];
  msg:string;

  files: TreeNode[];
  
  selectedFiles: TreeNode[];

  constructor(private httpservice: HttpService,private myService: WorkspaceService,) { 
    this.gettree()
  }

  ngOnInit() {
    
  }
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

  nodeSelect(event:any) {
    //event.node = selected node
}
  onNodeUnselect(e:any){
  }

}
