import { Component, OnInit } from '@angular/core';
import { beforeUrl, China, pageAnimation, tagAnimation, TreeNode } from '../../../common/public-data';
import NProgress from 'nprogress';
import { HttpService } from '../../../common/http.service';
import { WorkspaceService } from '../../../workspace/workspace.service';
import { Router } from '@angular/router'
import wangEditor from 'yushk'
import { parseHtmlToJson } from '../../../common/assist'

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
    articleTitle = "详细介绍如何预防感冒";
    editorContent: any;

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
    previewhtml: any


    constructor(private http: HttpService, private myService: WorkspaceService, public router: Router) {
        // NProgress.start();
        this.checklogin()
        this.getProfile(this.userId)
    }
    

    ngOnInit() {
        this.createEditor()
        // this.gettree()
        this.getIllTag()
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
            this.userpic = userinfo.headImgPath;
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

        editor.customConfig.onchange = (html) => {

            _this.editorContent = html
            var json = editor.txt.getJSON()
            var jsonStr = JSON.stringify(json)
            _this.getjson(html)
        }
        editor.create()
        this.editor = editor
    }
    getjson(html: any) {
        const { error, errorText, resJsonList } = parseHtmlToJson(html)
        console.log(error)
        console.log(errorText)
        if (error) {
            return
        }
        this.editForm.richJson = resJsonList
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
                const data: any = await this.http.request('http://viodoc.tpddns.cn:9500/api/viodoc/uploadPIC', {
                    body: form
                })
                var a = JSON.parse(data._body)
                this.editor.cmd.do('insertHTML', `<p class="article-image"><img  src=${a.picURL} owidth=${width} oheight=${height}></p>`)
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
                const readerFile: any = await this.readImageAttr(file)
                const width = readerFile.width
                const height = readerFile.height
                var video = JSON.parse(data._body)
                this.editor.cmd.do('insertHTML',
                    `<p class="article-video" ><video  src=${video.videoURL} poster=${video.videoPICURL} controls owidth=${width} oheight=${height}></video></p>`)
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
        return this.http.request('http://viodoc.tpddns.cn:9500/api/viodoc/uploadVideo', {
            body: form
        })
    }

    /**
     *  tree
     *
     * @stable
    */
    gettree() {
        this.myService.getMenu(this.treeUrl)
            .then(
            menus => {
                const a: any = menus
                this.files = a.data
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

    nodeSelect(event: any) {
       
        if (this.selectedFiles.length < 3) {
            if(event.node){
                for (let i = 0; i < this.selectedFiles.length; i++) {
                        if (event.node.label === this.selectedFiles[i].label) {
                            return
                        }
                    }
                this.selectedFiles.push(event.node);
            }else{
                for (let i = 0; i < this.selectedFiles.length; i++) {
                    if (event.label === this.selectedFiles[i].label) {
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
        debugger
        this.taglist=[]
        if(this.searchtag){
        this.taglist = this.http.traverse(this.files,this.searchtag,this.taglist)
        }
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
        debugger
        // this.display = true;
        var data: any = document.getElementById('preview-html')
        data.contentWindow.document.getElementById('title').innerText = this.articleTitle
        var str = '';
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
        this.previewhtml = `<!DOCTYPE html> <html> <head>${data.contentWindow.document.head.innerHTML}</head> <body> ${data.contentWindow.document.body.innerHTML} </body> </html>`
        console.log(this.previewhtml)
        if(e===1){
            html[0].style.display = 'block';
        }
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

    async saveAsDraft() {
        try {
            let tags = []
            for (let i = 0; i < this.selectedFiles.length; i++) {
                tags.push(String(this.selectedFiles[i].data))
            }
            this.editForm.title = this.articleTitle
            this.editForm.selectedCategoryIds = tags
            await this.verify()
            const {
            title: articleTitle,
                richJson: editorContent,
                summary: breviary,
                selectedCategoryIds: tag
        } = this.editForm
            let params = { articleTitle, content: JSON.stringify(editorContent), breviary, tag }
            await this.saveArticle(params)
            this.msgs = [];
            this.msgs.push({ severity: 'scuucess', summary: '保存为草稿成功', detail: `` });
            this.router.navigateByUrl("workspace/draft")
        } catch (e) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: '保存草稿失败', detail: `${e}` });
        }
    }

    async saveAsDeploy() {
        try {
            this.getPrewviewHtml(2)
            let tags = ['1','111']
            // for(let i=0;i<this.selectedFiles.length;i++){
            //     tags.push(String (this.selectedFiles[i].data))
            // }
            this.editForm.title = this.articleTitle
            this.editForm.selectedCategoryIds = tags
            this.editForm.htmlUrl = this.previewhtml
            await this.verify()
            const {
                    title,
                        richJson: articleContent,
                        summary: breviary,
                        selectedCategoryIds: tag,
                        htmlUrl: htmlUrl
                } = this.editForm
            let params = { title, content: JSON.stringify(articleContent), breviary, tag, htmlUrl }
            await this.saveAndPublish(params)
            this.msgs = [];
            this.msgs.push({ severity: 'scuucess', summary: '发布成功', detail: `` });
            this.router.navigateByUrl("workspace/article-list")
        } catch (e) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: '发布失败', detail: `${e}` });
        }
    }

    verify() {
        const {
            title,
            richJson,
            summary,
            selectedCategoryIds
        } = this.editForm
        if (!title) {
            throw new Error('请输入标题')
        }
        if (!richJson) {
            throw new Error('请输入文章内容')
        }
        if (selectedCategoryIds.length === 0) {
            throw new Error('请输入文章内容')
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
            header: this.http.makeBodyHeader({}),
            parentId: new Number(id)
        }
        try {
            const data: any = await this.http.newpost('api/viodoc/getSubjectTreeNode', JSON.stringify(json))
            var a = JSON.parse(data._body)
            var tree = a.subjectNode;
            return tree
        } catch (error) {

        }
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