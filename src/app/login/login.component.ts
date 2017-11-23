import { Component, OnInit } from '@angular/core';

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
  disableSubmit=false;
  //
  loginbutton = "登  录";
  // 失败信息
  passwordErrorText: string;

  
  constructor() { }

  ngOnInit() {
  }
  login(){
    debugger;
  }
}
