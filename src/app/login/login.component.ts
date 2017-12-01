import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import { HttpService } from '../common/http.service';


@Component({
  selector: 'app-longin',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //用户名
  username:string;     
  //用户密码
  password:string;

  disableSubmit = false;
  loginSuccess = false;
  passwordError = false;
  phoneError = true;
  phoneErrorText:string;
  //
  loginbutton = "登  录";
  // 失败信息
  passwordErrorText: string;

  
  constructor(private httpservice:HttpService, private router:Router) { }

  ngOnInit() {
  }
  async login () {
    const verifyResult = this.verify()
    if (!verifyResult) return
    try {
      this.disableSubmit = true
      const json={
        header: this.httpservice.makeBodyHeader({}, false),
        accountName: this.username,
        pwd: this.password
      }
      const doctor:any = await this.httpservice.newpost('api/viodoc/signIn',JSON.stringify(json))
      debugger
      const doctorInfo=JSON.parse(doctor._body)
      this.httpservice.storeset('ffys_user_info', doctorInfo.userInfo)
      this.httpservice.storeset('ffys_user_token', doctorInfo.token)

      this.disableSubmit = false
      this.loginSuccess = true
      this.redirect()
    } catch (err) {
      console.log(err)
    } 
  }

  redirect() {
    const user = this.httpservice.storeget('ffys_user_info')
    if (user) {
      // 是否通过认证，弹出下载app提示 || 当前默认进入文章列表页面
      // this.authPass = true || user.authPass
      this.loginSuccess = true
      // this.authPass && this.$router.push({name: 'content'})
      this.router.navigateByUrl("workspace");
    }
  }

  verify() {
    const changeVeriyPhoneRes = this.changeVeriyPhone();
    const changeVeriyPassRes = this.changeVeriyPass();
    return changeVeriyPhoneRes && changeVeriyPassRes;
  }

  changeVeriyPhone() {
    const regPhone = /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/
    if (!regPhone.test(this.username)) {
      this.phoneError = true
      this.phoneErrorText = '请输入准确的手机号码'
      return false
    }
    this.phoneError = false
    this.phoneErrorText = ''
    return true
  }

  changeVeriyPass() {
    if (!this.password) {
      this.passwordError = true
      this.passwordErrorText = '请输入密码'
      return false
    }
    this.passwordError = false
    this.passwordErrorText = ''
    return true
  }
}
