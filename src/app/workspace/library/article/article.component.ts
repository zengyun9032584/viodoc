import { Component, OnInit } from '@angular/core';
import { beforeUrl, China, pageAnimation, tagAnimation } from '../../../common/public-data';
import NProgress from 'nprogress';
import { HttpService } from '../../../common/http.service';
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
    constructor(private http: HttpService) {
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
    editor :any;
    ngOnInit() {
        var date = new Date();
        date = new Date(date.getTime()-1000*60*60*24);
        var month = date.getMonth() >= 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
        var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
        this.date = `${date.getFullYear()}${month}${day}`;
        // this.getData();

        this.createEditor()
       
    }

    createEditor(){
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
            'quote',  // 引用
            'emoticon',  // 表情
            // 'image',  // 插入图片
            'table',  // 表格
            // 'video',  // 插入视频
            // 'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
        ]
        editor.create()
    }
 

    getData() {
        let url = this.http.getServerIP();
        this.http.get(`${url}/api/daily?date=${this.date}`).then(
            success => {
                if(success.error === ''){
                    this.items = success.items;
                    this.isEmpty = 'success';
                } else {
                    this.isEmpty = 'empty';
                    this.items = [];
                }
                debugger;
                NProgress.done();
            }
        ).catch(
            err => {
                // alert(err);
                this.isEmpty = 'empty';
                this.items = [];
                NProgress.done();
            }
        )
    }

    showLoginWindow() {
        this.display = true;
    }

    selectDate() {
        debugger;
        var month = this.selectTime.getMonth() >= 9 ? this.selectTime.getMonth() + 1 : '0' + (this.selectTime.getMonth() + 1);
        var day = this.selectTime.getDate() > 9 ? this.selectTime.getDate() : '0' + this.selectTime.getDate();
        this.date = `${this.selectTime.getFullYear()}${month}${day}`;
        this.getData();
    }

    collect(index: any) {
        if (sessionStorage.getItem('userToken')) {
            this.selectedItemName = this.items[index].name;
            this.selectedItemHref = this.items[index].href;
            this.selectedItemClass = "";
            this.selectedItemTags = "";
            this.showLoginWindow();
        } else {
            this.msgs = [];
            this.msgs.push({severity:'warn', summary:'未登录', detail:'收藏功能在账号登陆后才可使用！'});    
        }
    }

    postCollect() {
        let postBody = {
            name: this.selectedItemName,
            href: this.selectedItemHref,
            class: this.selectedItemClass,
            tags: this.selectedItemTags,
            user: sessionStorage.getItem('realname')
        }
        let url = this.http.getServerIP();
        debugger;
        this.http.post(`${url}/api/collect`, JSON.stringify(postBody)).then(
            success => {
                this.msgs = [];
                if (success.info === 'collect successed!') {
                    this.msgs.push({ severity: 'success', summary: '收藏成功', detail: `收藏成功！` });
                } else {
                    this.msgs.push({ severity: 'warn', summary: '收藏失败', detail: `${success.error}` });
                }
                this.display = false;
            }
        ).catch(
            error => {
                this.msgs.push({ severity: 'error', summary: 'error Message', detail: `${error}` });
                this.display = false;
            }
        )
    }
}