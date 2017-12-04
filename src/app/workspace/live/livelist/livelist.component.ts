
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router';
import { debug, error } from 'util';
import { HttpService } from '../../../common/http.service'
import { WorkspaceService } from '../../workspace.service';
import { pageAnimation, tagAnimation, LiveData, LiveDetail,TreeNode } from '../../../common/public-data';
import {SelectItem} from 'primeng/primeng';

/**
 *  直播列表组件
 *
 * @stable
 */
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
  msgs: any;
  livelist:LiveData[]
  display = false
  token:any
  liveinfo:LiveDetail
  userId:any
  liveID:any
  piclist = []      //直播课件列表
  backuppiclist = [] // 直播课件列表备份

  types: SelectItem[];
  
  selectedType="title";

  files = new Array<TreeNode>();
  selectedFiles: TreeNode[];
  tree: any[];

  realname: string = '未登录'; 
  userpic:string;

  constructor(private httpservice:HttpService,public router: Router,private myService: WorkspaceService) {
    // this.getIllTag();
    this.types = [];
    this.types.push({label: '列表', value: 'list'});
    this.types.push({label: '标签', value: 'title'});

    this.checklogin()
   }

  ngOnInit() {
  
   this.getlivelist()
   
  }

  //没有使用
  async getIllTag() {
    try {
      this.tree = await this.getsubjectlist(0)
      this.traverse(this.tree, this.files)
    } catch (error) {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: '获取标签列表失败', detail: `${error}` });
    }
  }

/**
 *  遍历
 *
 * @stable
 */
  async traverse(e: any[], file: TreeNode[]) {
    if(!e){return}
    for (let i = 0; i < e.length; i++) {
      var data = new TreeNode()
      data.label = e[i].nodeName
      data.data = e[i].nodeId
      data.children = new Array<TreeNode>();
      try{
        e[i].chilren = await this.getsubjectlist(e[i].nodeId)
        file[i] = data
        if (e[i].chilren.length > 0) {
          this.traverse(e[i].chilren, file[i].children)
        } else {
          break
        }
      }catch(error){
      console.log("traverse err")
      }
    }
  }


  nodeSelect(event: any) {
    this.selectedFiles.push()
    //event.node = selected node
  }
  onNodeUnselect(e: any) {
    debugger
  }
  
/**
 *  检查是否登录，登录信息存储在localstorage
 *
 * @stable
*/
  checklogin(){
    if (this.httpservice.storeget('ffys_user_info')) {
      const userinfo:any = this.httpservice.storeget('ffys_user_info')
      this.realname = userinfo.name;
      this.userpic = userinfo.headImgPath;
      this.userId = userinfo.userId;
      if( this.realname===""){
        this.router.navigateByUrl("login");
      }
    } else {
      this.router.navigateByUrl("login");
    }
  }
  
  /**
 *  显示直播详细信息
 *
 * @stable
 */
  showliveinfo(item:any,i:any){
    this.checklogin()
    // this.liveinfo = item;
    this.GetLiveDetails(item)
  }

  /**
 *  获取直播列表
 *
 * @stable
 */
  async getlivelist () {
    try {
      const json={
        header: this.httpservice.makeBodyHeader({}, false),
        page: {
          pageNo:1,
          pageSize:12,
          total:1
        },
        anchorId: this.userId
      }
      debugger
      const doctor:any = await this.httpservice.newpost('api/viodoc/getSomebodyLiveList',JSON.stringify(json))
      var a:any=JSON.parse(doctor._body)
      this.livelist=a.anchorLivinglist
      // for(let i=0; i<10;i++){
      //   this.livelist.push(a.anchorLivinglist)
      // }
    } catch (error) {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: '获取直播列表失败', detail: `${error}` });
    } 
  }


  /**
 *  获取直播详细信息
 *
 * @stable
 */
async GetLiveDetails(e:any){
  try {
    const json={
      header: this.httpservice.makeBodyHeader({}, false),
      liveId: e.liveId
    }
    const data:any = await this.httpservice.newpost('api/viodoc/getLiveDetails',JSON.stringify(json))
    var a:any=JSON.parse(data._body)
    this.liveinfo = a.live
    this.getlivepiclist(e);
  } catch (err) {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: '获取直播详细信息失败', detail: `${error}` });
  } 
}

 /**
 *  获取直播内课件
 *
 * @stable
 */
  async getlivepiclist(e:any){
    try {
      const id:Number = new Number(e.liveId)
      const json={
        header: this.httpservice.makeBodyHeader({}, false),
        liveId: id
      }
      const data:any = await this.httpservice.newpost('api/viodoc/getLivePIC',JSON.stringify(json))
      var a:any=JSON.parse(data._body)
      this.piclist=a.picUrl
      this.display=true;
     
    } catch (error) {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: '获取直播课件失败', detail: `${error}` });
    } 
  }

  /**
 *  获取直播标签
 *
 * @stable
 */
  async getsubjectlist(id:any){
    const json={
      header:this.httpservice.makeBodyHeader({}, false),
      parentId: new Number(id)
    }
    try{
    const data: any =await this.httpservice.newpost('api/viodoc/getSubjectTreeNode',JSON.stringify(json))
    var a = JSON.parse(data._body)
    var tree = a.subjectNode;
  
    } catch(error){
      console.log(error)
    }
    return tree
  }

  async imgOperate(event:any) {
    const files = event.target.files
    if (files.length === 0) return
    
    
    for(let i=0;i<files.length;i++){
      var file = files[i]
      const readerFile:any = await this.readImageAttr(file)
      const width = readerFile.width
      const height = readerFile.height
      if (/\.(gif|jpg|jpeg|tiff|png)$/.test(file)) {
        return alert('请上传正确的图片格式')
      }
      let dotIndex = file.name.lastIndexOf('.')
      const ext = file.name.substring(dotIndex + 1, file.name.length)
      const form:any = this.uploadImage(file, ext, width, height)
      try {
      const data:any = await this.httpservice.request('http://viodoc.tpddns.cn:9500/api/viodoc/uploadPIC', {
          body:form
        })
        var a = JSON.parse(data._body)
        this.piclist.push(a.picURL);
      }catch(error){
            alert(error)
      }
    }
 
  }

 /**
 *  显示图片详细
 *
 * @stable
 */
  previewimg(e:any){
    window.open(e.target.src)
  }

   /**
 *  读取图片信息
 *
 * @stable
 */
  readImageAttr (file) {
    return new Promise(function (resolve, reject) {
      const src = URL.createObjectURL(file)
      const img = new Image()
      img.src = src
      img.onload = _ => {
        resolve({
          width: img.width,
          height: img.height,
          src:img.src
        })
      }
      img.onerror = _ => {
        // 失败 给个假的吧
        resolve({
          width: '200',
          height: '150',
          src:img.src
        })
      }
    })
  }

   /**
 *  上传图片，返回图片url
 *
 * @stable
 */
  uploadImage (file, ext, width, height) {

    const form = new FormData()
    let HJson = this.httpservice.makeBodyHeader()
    let HString = JSON.stringify(HJson)
    form.append('header', HString)
    form.append('picContent', file)
    form.append('fileName', `article_imgage_${new Date().getTime()}`)
    form.append('extName', ext)
    form.append('height', height)
    form.append('width', width)
    return form
  }

  delpic(e:any,index:any){
    this.piclist.splice(index,1)
  }

  editliveinfo(e:any,str:string){
    var data:any= document.getElementById(str)
    data.readOnly = false;
    data.focus()
  }

/**
 *  上传直播课件
 *
 * @stable
 */
  async uploadlivepiclist(id:Number){
    const json={
      header:this.httpservice.makeBodyHeader({}, false),
      liveId:new Number(id),
      picUrl:this.piclist
    }
    try{
      const data:any = this.httpservice.newpost("api/viodoc/uploadHttpLivePIC",JSON.stringify(json))
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: '上传成功', detail: `` });
    }
    catch(error){
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: '上传图片失败', detail: `${error}` });
      // alert(error)
    }
  }

  /**
 *  上传直播信息
 *
 * @stable
 */
async uploadliveinfo(e:LiveDetail){
  const json={
    header:this.httpservice.makeBodyHeader({}, false),
    // type:e.tags,
    comment:e.comment,
    pic:e.pic,
    title:e.title,
    liveId:e.liveId,
    groupId:e.groupId
  }
  try{
    const data:any =await this.httpservice.newpost("api/viodoc/editLive",JSON.stringify(json))
    this.getlivelist()
  }
  catch(error){
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: '保存直播信息失败', detail: `${error}` });
  }
}

  update(e:LiveDetail){
    this.uploadlivepiclist(e.liveId)
    this.uploadliveinfo(e)
   
    this.close()
  }

  close(){
    this.liveinfo=null;
    this.display=false;

  }



}
