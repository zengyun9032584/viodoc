import { Component, OnInit } from '@angular/core';
import { pageAnimation, tagAnimation,LiveData } from '../../../common/public-data';
import { debug } from 'util';


const LiveList: LiveData[]=[
  { 
    title:"吹空调会面瘫么吹空调会面瘫么吹空调会面瘫么",
    name:"王玉涛",
    time:"2017年1月1日",
    status:"直播中",
    introduce:"最近有新闻说，2岁的宝宝，吹空调",
    content:"最近有新闻说，2岁的宝宝，吹空调",
    file:""
  },
  { 
    title:"吹空调会面瘫么",
    name:"王玉涛",
    time:"2017年1月1日",
    status:"直播中",
    introduce:"最近有新闻说，2岁的宝宝，吹空调",
    content:"最近有新闻说，2岁的宝宝，吹空调",
    file:""
  },
  { 
    title:"吹空调会面瘫么",
    name:"王玉涛",
    time:"2017年1月1日",
    status:"直播中",
    introduce:"最近有新闻说，2岁的宝宝，吹空调",
    content:"最近有新闻说，2岁的宝宝，吹空调",
    file:""
  },
  
]



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
  livelist=LiveList
  display = false
  userId :any
  token:any
  constructor() { }
  piclist = ['assets/image/sport.jpg',
  'assets/image/timg.jpeg',
  'assets/image/timg.jpeg',
  'assets/image/timg.jpeg',
  'assets/image/timg.jpeg',
  'assets/image/timg.jpeg',
  'assets/image/timg.jpeg']
  ngOnInit() {
  }

  showliveinfo(){
    this.display=true;
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
    debugger
    this.piclist.push(readerFile.src)
    // ApiInvoke.uploadImage(file, ext, width, height).then(data => {
    //   this.editor.cmd.do('insertHTML', `<p><img src=${data.picURL} owidth=${width} oheight=${height}></p>`)
    // }).catch(errorHandle)
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
    let  userId  = sessionStorage.get('ffys_user_info')
    let json ={
      header:1
    }
    if (!userId) throw new Error('用户id丢失')
    const form = new FormData()
    let HJson = this.makeBodyHeader()
    let HString = JSON.stringify(HJson)
    form.append('header', HString)
    form.append('picContent', file)
    form.append('fileName', `article_imgage_${new Date().getTime()}`)
    form.append('extName', ext)
    form.append('height', width)
    form.append('width', height)

    // return this.Invoke('api/viodoc/uploadPIC', {
    //   body: form
    // })

    
  }

  makeBodyHeader (params = {}, needAuth = true) {
    this.token = sessionStorage.get('ffys_user_token') || null
    this.userId = sessionStorage.get('ffys_user_info') && sessionStorage.get('ffys_user_info').userId || null
    if (!this.userId && needAuth) throw new Error('用户丢失,请按 F5 刷新')
    if (!this.token && needAuth) throw new Error('用户token丢失,请按 F5 刷新')
    const timeStamp = new Date().getTime()
    // const nonce = generateUUID()
    // const signature = sha256(`049ddf35f8f43f0058176da1c9c462b3fcffaa3b3822767dd28c60618e76da70${timeStamp}${nonce}`)
    const appType = 4
    // console.log(signature)
    return Object.assign(params, {
      timeStamp,
      // nonce,
      // signature,
      appType,
      token: this.token,
      userId: this.userId && Number(this.userId)
    })
  }

  delpic(e:any){
    debugger
  }
}
