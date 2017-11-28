
import { Component, OnInit } from '@angular/core';
import { pageAnimation, tagAnimation,LiveData } from '../../../common/public-data';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router';
import { debug, error } from 'util';
import { HttpService } from '../../../common/http.service'


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
  msgs = ["1","1","1","11","1","q","1"];
  livelist:LiveData[]
  display = false
  token:any
  liveinfo:LiveData
  userId:any
  liveID:any

  constructor(private httpservice:HttpService,public router: Router,) { }
  piclist = []
  ngOnInit() {
   this.checklogin()
   this.getlivelist()
  }

/**
 *  检查是否登录，登录信息存储在localstorage
 *
 * @stable
*/
  checklogin(){
    if (this.httpservice.storeget('ffys_user_info')) {
      const userinfo:any = this.httpservice.storeget('ffys_user_info')
      this.userId = userinfo.userId;
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
    this.display=true;
    this.liveinfo = item;

    this.getlivepiclist( this.liveinfo);
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
        anchorId: 480
      }
      const doctor:any = await this.httpservice.newpost('api/viodoc/getSomebodyLiveList',JSON.stringify(json))
      var a:any=JSON.parse(doctor._body)
      this.livelist=a.anchorLivinglist
    } catch (err) {
      console.log(err)
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
    } catch (err) {
      console.log(err)
    } 
  }

  async imgOperate(event:any) {
    const files = event.target.files
    if (files.length === 0) return
    var file = files[0]
    const readerFile:any = await this.readImageAttr(file)
    const width = readerFile.width
    const height = readerFile.height
    if (/\.(gif|jpg|jpeg|tiff|png)$/.test(file)) {
      return alert('请上传正确的图片格式')
    }
    let dotIndex = file.name.lastIndexOf('.')
    const ext = file.name.substring(dotIndex + 1, file.name.length)
    const form:any = this.uploadImage(file, ext, width, height)
    debugger
    const json={
      body:form
    }
     this.httpservice.post('http://viodoc.tpddns.cn:9500/api/viodoc/uploadPIC', json).then(
        success=>{
          debugger
          this.piclist.push(success.picURL)
        },error=>{
          alert(error)
        })
      debugger 
     
        // this.editor.cmd.do('insertHTML', `<p><img src=${data.picURL} owidth=${width} oheight=${height}></p>`)
     
  }
 /**
 *  显示图片详细
 *
 * @stable
 */
  previewimg(e:any){
    window.open(e.target.src)
  }

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

  uploadImage (file, ext, width, height) {
    let  userId  = this.httpservice.storeget('ffys_user_info')
    if (!userId) throw new Error('用户id丢失')
    const form = new FormData()
    let HJson = this.httpservice.makeBodyHeader()
    let HString = JSON.stringify(HJson)
    form.append('header', HString)
    form.append('picContent', file)
    form.append('fileName', `article_imgage_${new Date().getTime()}`)
    form.append('extName', ext)
    form.append('height', height)
    form.append('width', width)
    // var json={
    //   // body:form
    //   header:HString,
    //   picContent:file,
    //   fileName:`article_imgage_${new Date().getTime()}`,
    //   extName:ext,
    //   height:height,
    //   width:width
    // }
    return form
  }

  delpic(e:any,index:any){
    this.piclist.splice(index,1)
  }

  editliveinfo(e:any,str:string){
    debugger
    var data:any= document.getElementById(str)
    data.readOnly = false;
    data.focus()
  }
}
