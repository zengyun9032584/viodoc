import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router';
// import {Car, Message} from '../common/car';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { WorkspaceService } from './workspace.service';
import { HttpService } from '../common/http.service';
import {beforeUrl,UserInfo} from '../common/public-data';


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
  animations: [
    trigger('menuState', [
      state('inactive', style({
        left: '0px'
      })),
      state('active', style({
        left: '-110px'
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ]),
    trigger('routerState', [
      state('inactive', style({
        marginLeft: '170px'
      })),
      state('active', style({
        marginLeft: '50px'
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ]),
    trigger('imgState', [
      state('inactive', style({
        left: '16px'
      })),
      state('active', style({
        left: '123px'
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ])
  ]
})
export class WorkspaceComponent implements OnInit {

  private menuUrl = 'assets/data/user-menu.json';
  

  constructor(private myService: WorkspaceService, public router: Router, private http: HttpService) {
  };

  ngOnInit() {
    this.getMenu();
    if (this.http.storeget('ffys_user_info')) {
      const userinfo:any = this.http.storeget('ffys_user_info')
      this.realname = userinfo.name;
      this.userpic = userinfo.headImgPath;
      if( this.realname===""){
        this.router.navigateByUrl("login");
      }
    } else {
      this.router.navigateByUrl("login");
    }
  }
  /*************************  ********************************/
  informationNumber: any = 18;                      //头部我的消息数量
  menus: any[];                                    //菜单
  msgs = [];                            //消息
  state: string = 'inactive';                      //菜单状态
  pTooltipIf: boolean = false;                     //pTooltipIf状态
  // beforeUrl: string = beforeUrl;                   //api前缀地址
  timeout: any;                                    //错误信息时间
  realname: string = '未登录';                      //头部账号名字
  menumsg: string;
  display = false;
  userName: string;
  password: string;
  userpic:string;
  /************************* 获取菜单 ********************************/
  getMenu() {
    // if (sessionStorage.getItem('menu111')) {
    //   this.menus = JSON.parse(sessionStorage.getItem('menu111'));
    //   console.log(this.menus);
    // } else {
      this.myService.getMenu(this.menuUrl)
        .then(
        menus => this.menus = menus,
        error => {
          this.menumsg = '获取菜单失败,请刷新再试'
        }
        )
        .then(() => {
          if (this.menus) {
            sessionStorage.setItem('menu111', JSON.stringify(this.menus));
          }
        });
    // }

  }
  /************************* 改变左侧菜单宽度 ********************************/
  changeMenuWidth() {
    this.state = (this.state === 'active' ? 'inactive' : 'active');
    //dom操作
    let fa = document.getElementsByClassName('ui-accordion-header');
    if (this.state == 'active') {
      for (let i = 0; i < fa.length; i++) {
        fa[i].getElementsByTagName('span')[0].style.display = 'none';
      }
      this.pTooltipIf = true;
    } else {
      for (let i = 0; i < fa.length; i++) {
        fa[i].getElementsByTagName('span')[0].style.display = 'block';
      }
      this.pTooltipIf = false;
    }
  }

  showLoginWindow() {
    // this.display = true;
  }

  /************************* 退出登录 ********************************/
  loginOut() {
    debugger
    try{
      
      const json={
        body:JSON.stringify({
          header: this.http.makeBodyHeader()
        })
      }
      debugger
      this.http.newpost('api/viodoc/signOut', JSON.stringify(json))
      this.realname = '未登录';  
      this.http.storeremove("ffys_user_info")
      this.http.storeremove("ffys_user_token")
      this.router.navigateByUrl("login");

    } catch(err){
      console.log("登出失败"+err)
    }

  }

  
}
