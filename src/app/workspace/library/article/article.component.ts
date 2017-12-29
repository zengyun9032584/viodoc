import { Component, OnInit } from '@angular/core';
import { beforeUrl, China, pageAnimation, tagAnimation, TreeNode } from '../../../common/public-data';
import NProgress from 'nprogress';
import { HttpService } from '../../../common/http.service';
import { WorkspaceService } from '../../../workspace/workspace.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import wangEditor from 'yushk'
import { parseHtmlToJson, previewHtml, parseJsonHtml } from '../../../common/assist'
import 'rxjs/add/operator/switchMap';

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
    msgs: any;
    selectTime = new Date();
    date: any;
    display = false;

    // editor  
    editor: any;
    articleTitle = '';
    editorContent='';
    setEditorContent = ''
    editForm = {
        title: '',
        richText: '',
        summary: '',
        selectedCategoryIds: [],
        category: [],
        richJson: null,
        htmlUrl: ''
    }

    // tree
    treeUrl = 'assets/data/tree.json';
    treedata: any[];
    msg: any;
    searchtag=''
    taglist = new Array<any>()

    files = new Array<TreeNode>();
    selectedFiles = new Array<TreeNode>();
    tree: any[];
    tagtree = false;

    showpreview = false;
    //userinfo
    realname: any
    userpic: any
    userId: any
    jobTitle

    // preview html
    previewhtmldata: any

    //editor 草稿
    contentId='';
    articleId = '';

    constructor(private http: HttpService, 
        private myService: WorkspaceService,
         public router: Router,
         private route: ActivatedRoute,
        ) {
        // NProgress.start();
        this.checklogin()
      
    }
    
    
   ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id')
    const reg=/^[0-9]*$/
    if(id.match(reg)&& id !=='0'){
      this.getDraftDetail(id)
    }else{
        this.createEditor();
    } 
    this.getProfile(this.userId)
 

    this.http.currentSelectedPoint().subscribe((value: any)=>{
        this.files = value;
    });
    // this.files = this.http.files;
    if(this.files.length===0){
        this.http.getIllTag();
    }
    }



    /**
 *  检查是否登录，登录信息存储在localstorage
 *
 * @stable
*/
    checklogin() {
        if (this.http.storeget('ffys_user_info')) {
            const userinfo: any = this.http.storeget('ffys_user_info')
            this.realname = userinfo.name;
            if(userinfo.headImgPath===''){
                this.userpic = '/assets/img/default.jpg'
            }else{
                this.userpic = userinfo.headImgPath;
            }
          
            this.userId = userinfo.userId;
            if (this.realname === "") {
                this.router.navigateByUrl("login");
            }
        } else {
            this.router.navigateByUrl("login");
        }
    }
    /**
     *  生成editor
     *
     * @stable
    */
    createEditor() {
        const _this = this
        var editor
        var div = document.getElementById('editor')
        editor = new wangEditor('#editormenu', div)
        editor.customConfig.zIndex = 100
        editor.customConfig.menus = [
            // 'head',  // 标题
            // 'bold',  // 粗体
            // 'italic',  // 斜体
            // 'underline',  // 下划线
            // 'strikeThrough',  // 删除线
            // 'foreColor',  // 文字颜色
            // 'backColor',  // 背景颜色
            // 'link',  // 插入链接
            // 'list',  // 列表
            // 'justify',  // 对齐方式
            // 'quote',  // 引用
            // 'emoticon',  // 表情
            // 'image',  // 插入图片
            // 'table',  // 表格
            // 'video',  // 插入视频
            // 'code',  // 插入代码
            // 'undo',  // 撤销
            // 'redo'  // 重复
        ]

        editor.customConfig.onchange = (html) => {
            var json = editor.txt.getJSON()
            var jsonStr = JSON.stringify(json)
            _this.getjson(html)
        }
        // 创建编辑器
        editor.create()
        // 编辑文章 设置编辑器内容
        if(this.setEditorContent!==''){
            
            editor.txt.html(this.setEditorContent)
        }
        this.editor = editor
    }

    /**
    *  读取编辑器内内容,解析为json
    *
    * @stable
    */
    getjson(html: any) {
        const { error, errorText, resJsonList } = parseHtmlToJson(html)
        console.log(error)
        console.log(errorText)
        if(error){
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: '格式错误', detail: `${errorText}` });
        }
        this.editForm.richJson = resJsonList
        this.editorContent=previewHtml(resJsonList)
    }

    /**
    *  读取图片信息
    *
    * @stable
    */
    readImageAttr(file) {
        return new Promise(function (resolve, reject) {
            const src = URL.createObjectURL(file)
            const img = new Image()
            img.src = src
            img.onload = _ => {
                resolve({
                    width: img.width,
                    height: img.height,
                    src: img.src
                })
            }
            img.onerror = _ => {
                // 失败 给个假的吧
                resolve({
                    width: '200',
                    height: '150',
                    src: img.src
                })
            }
        })
    }

    /**
  *  上传图片，返回图片url
  *
  * @stable
  */
    uploadImage(file, ext, width, height) {
        const form = new FormData()
        let HJson = this.http.makeBodyHeader()
        let HString = JSON.stringify(HJson)
        form.append('header', HString)
        form.append('picContent', file)
        form.append('fileName', `article_imgage_${new Date().getTime()}`)
        form.append('extName', ext)
        form.append('height', height)
        form.append('width', width)
        return form
    }
    /**
     *  upload pic video
     *
     * @stable
    */
    fileInputClick(ref) {
        var node: any = document.getElementById(ref)
        node.value = ""
        node.click();
    }

    async imgOperate(event: any) {
        const files = event.target.files
        if (!files.length) return

        for (let i = 0; i < files.length; i++) {
            var file = files[i]
            const readerFile: any = await this.readImageAttr(file)
            const width = readerFile.width || ""
            const height = readerFile.height || ""
            let dotIndex = file.name.lastIndexOf('.')
            const ext: string = file.name.substring(dotIndex + 1, file.name.length)
            const form: any = this.uploadImage(file, ext, width, height)
            try {
                const data: any = await this.http.request('api/viodoc/uploadPIC', {
                    body: form
                })
                var a = JSON.parse(data._body)
                this.editor.cmd.do('insertHTML', `<p><img  src=${a.picURL} owidth=${width} oheight=${height}></p>`)
            } catch (error) {
                this.msgs = [];
                this.msgs.push({ severity: 'error', summary: '上传图片失败', detail: `${error}` });
            }
        }

    }
    videoOperate(e: any) {
        const files = e.target.files
        if (!files.length) return
        const file = files[0]
        try {
            let dotIndex = file.name.lastIndexOf('.')
            const ext = file.name.substring(dotIndex + 1, file.name.length)
            this.uploadVideo(file, ext).then(async (data: any) => {
                debugger
                const readerFile: any = await this.readImageAttr(file)
                const width = readerFile.width
                const height = readerFile.height
                var video = JSON.parse(data._body)
                this.editor.cmd.do('insertHTML',
                    `<p><video  src=${video.videoURL} poster=${video.videoPICURL} controls owidth=${width} oheight=${height}></video></p>`)
            })
        } catch (err) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: '发布失败', detail: `${err}` });

        }
    }

    uploadVideo(file, ext) {
        const form = new FormData()
        let HJson = this.http.makeBodyHeader()
        let HString = JSON.stringify(HJson)
        form.append('header', HString)
        form.append('videoContent', file)
        form.append('firstPicContent', '')
        form.append('firstPicName', '')
        form.append('firstPicExtName', '')
        form.append('videoFileName', `article_video_${new Date().getTime()}`)
        form.append('videoExtName', ext)
        return this.http.request('api/viodoc/uploadVideo', {
            body: form
        })
    }

    nodeSelect(event: any) {
        if (this.selectedFiles.length < 3) {
            if(event.node){
                for (let i = 0; i < this.selectedFiles.length; i++) {
                        if (event.node.data === this.selectedFiles[i].data) {
                            this.msgs = [];
                            this.msgs.push({ severity: 'warning', summary: '已经选过了,老铁', detail: `` });
                            return
                        }
                    }
                this.selectedFiles.push(event.node);
            }else{
                for (let i = 0; i < this.selectedFiles.length; i++) {
                    if (event.data === this.selectedFiles[i].data) {
                        this.msgs = [];
                        this.msgs.push({ severity: 'warning', summary: '已经选过了,老铁', detail: `` });
                        return
                    }
                }
                    this.selectedFiles.push(event);
                }
           
        }else{
            this.msgs = [];
            this.msgs.push({ severity: 'warning', summary: '只能选择3个标签', detail: `` });
        }
        this.searchtag = '';
        this.taglist = [];
    }
    searchActicletag(){
        this.taglist=[]
        if(this.searchtag){
        this.taglist = this.http.traverse(this.files,this.searchtag,this.taglist)
        }
        debugger
    }

    del(event: any) {
        for (let i = 0; i < this.selectedFiles.length; i++) {
            if (event.label === this.selectedFiles[i].label) {
                this.selectedFiles.splice(i, 1)
            }
        }
    }

    /**
     *  get preview html
     *
     * @stable
    */
    getPrewviewHtml(e:any) {
        var data: any = document.getElementById('preview-html')
        data.contentWindow.document.getElementById('title').innerText = this.articleTitle
        var str = '';
        // this.selectedFiles = [{label:'头部'},{label:'编的'}]
        for (let i = 0; i < this.selectedFiles.length; i++) {
            str += `<span>${this.selectedFiles[i].label}</span>`
        }
        data.contentWindow.document.getElementById('title').innerText = this.articleTitle
        data.contentWindow.document.getElementById('authorAvatar').src = this.userpic;
        data.contentWindow.document.getElementById('authorName').innerText += this.realname;
        data.contentWindow.document.getElementById('jobTitle').innerText += this.jobTitle;
        data.contentWindow.document.getElementById('articletag').innerHTML += str;
        data.contentWindow.document.getElementById('content').innerHTML += this.editorContent
       
        var html: any = document.getElementsByClassName('preview-layer')
        this.previewhtmldata = `<!DOCTYPE html> <html> <head>${data.contentWindow.document.head.innerHTML}</head> <body> ${data.contentWindow.document.body.innerHTML} </body> </html>`
        console.log(this.previewhtmldata)
        if(e===1){
            html[0].style.display = 'block';
        }
    }

    /**
     *  get preview html
     *
     * @stable
    */
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

    /**
     *  保存草稿
     *
     * @stable
    */
    async saveAsDraft() {
        try {
            let tags = []
            for (let i = 0; i < this.selectedFiles.length; i++) {
                tags.push(String(this.selectedFiles[i].data))
            }
            this.editForm.title = this.articleTitle
            this.editForm.selectedCategoryIds = tags

            if( this.verify() ){
                return
            } 
            const {
                title: title,
                richJson: editorContent,
                summary: breviary,
                selectedCategoryIds: tag
            } = this.editForm
            var params
            if(this.contentId===''){
                params =  { title, 
                    content: JSON.stringify(editorContent), 
                    breviary, tag,
                    articleId:Number(this.articleId) }
                
            }else{
                params ={ title, 
                    content: JSON.stringify(editorContent), 
                    breviary, tag,
                    articleId:Number(this.articleId) }
            }
            await this.saveArticle(params)
            this.msgs = [];
            this.msgs.push({ severity: 'scuucess', summary: '保存为草稿成功', detail: `` });
            this.router.navigateByUrl("workspace/draft")
        } catch (e) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: '保存草稿失败', detail: `${e}` });
        }
    }

    /**
 *  保存 并发布
 *
 * @stable
*/
    async saveAsDeploy() {
        try {
            
            document.getElementById('pushbtn').setAttribute('disabled',"true")
            let tags = []
            for(let i=0;i<this.selectedFiles.length;i++){
                tags.push(String (this.selectedFiles[i].data))
            }
            this.editForm.title = this.articleTitle
            this.editForm.selectedCategoryIds = tags
            this.getPrewviewHtml(2)
            this.editForm.htmlUrl = this.previewhtmldata
            
            if( this.verify() ){
                document.getElementById("pushbtn").removeAttribute("disabled");
                return
            } 
            const {
                    title,
                    richJson: articleContent,
                    summary: breviary,
                    selectedCategoryIds: tag,
                    htmlUrl: htmlUrl
                } = this.editForm
                debugger
                for(let i=0 ;i<articleContent.length;i++){
                    articleContent[i].content = articleContent[i].content.replace(/<(.*?)>/g,'')
                }
                debugger
                var params
                //新建文章
                if(this.contentId===''){
                    params = { title, content: JSON.stringify(articleContent),
                        breviary, tag, htmlUrl,
                        articleId:Number(this.articleId) }
                }else{
                // 编辑保存文章    
                    params = { title, content: JSON.stringify(articleContent),
                        breviary, tag, htmlUrl,contentId:this.contentId,
                        articleId:Number(this.articleId) }
                }
            await this.saveAndPublish(params)
            this.msgs = [];
            document.getElementById("pushbtn").removeAttribute("disabled");
            this.msgs.push({ severity: 'scuucess', summary: '发布成功', detail: `` });
            this.router.navigateByUrl("workspace/article-list")
        } catch (e) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: '发布失败', detail: `${e}` });
         
            return
        }
    }

    verify() {
        const {
            title,
            richJson,
            summary,
            selectedCategoryIds
        } = this.editForm
        try{
            var regx = /^[\u4E00-\u9FA5A-Za-z0-9,?.]+$/
            var reg = /^[ ]+$/
            if (!title || reg.test(title)) {
                throw new Error('请输入标题')
            }
            if (!richJson) {
                throw new Error('请输入文章内容')
            }
            // if (selectedCategoryIds.length === 0) {
            //     throw new Error('请输选择文章标签')
            // }
        }catch(err){
            this.msgs = [];
            this.closePreview()
            this.msgs.push({ severity: 'error', summary: '发布失败', detail: `${err}` });
            return 1
        }
        
    }
     // 获取草稿详情
    async getDraftDetail (articleID) {
        try{
            const data:any = await this.http.newpost('api/viodoc/getArticleContent', 
            JSON.stringify({
             header: this.http.makeBodyHeader(),
             articleID: Number(articleID)
           })
         )
         const content = JSON.parse(data._body).articleDetail.content;
         this.articleTitle = JSON.parse(data._body).articleDetail.title;
         var tag = JSON.parse(data._body).articleDetail.subject
         for (let i=0; i<tag.length;i++){
             var a:any ={label:tag[i].nodeName,data:tag[i].nodeId}
             this.selectedFiles.push(a)
         }
         this.contentId = JSON.parse(data._body).articleDetail.contentId
         this.articleId = JSON.parse(data._body).articleDetail.articleId

         // 获取设置预览 html
         this.setEditorContent = parseJsonHtml(JSON.parse(content))
         this.editorContent = previewHtml(JSON.parse(content))
         // 获取发布html
         this.editForm.richJson = JSON.parse(content);
         //创建编辑器
         this.createEditor()
        }catch(error){
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: '获取草稿失败', detail: `${error}` });
            this.createEditor()
        }
    }

    // 保存为草稿
    saveArticle(articleDetail) {
        return this.http.newpost('api/viodoc/saveArticle',
            JSON.stringify({
                header: this.http.makeBodyHeader(),
                userId: String(this.userId),
                articleDetail: articleDetail
            })
        )
    }

    // 保存并发布
    saveAndPublish(articleDetail) {
        return this.http.newpost('api/viodoc/publishArticle',
            JSON.stringify({
                header: this.http.makeBodyHeader(),
                userId: String(this.userId),
                articleDetail: articleDetail
            })
        )
    }

    getProfile (userId) {
        return this.http.newpost('api/viodoc/getProfile', 
          JSON.stringify({
            header: {
              userId: Number(userId)
            },
            userId: Number(userId)
          })
        ).then(data => {
          if (!data) {
            throw new Error('无效的用户Id')
          }
          const  a: any = data
          this.jobTitle = JSON.parse(a._body).drInfo.jobTitle
          return data
        })
      }



}

