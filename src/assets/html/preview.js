if (typeof (window.Vioxclient) == "undefined") {
    window.Vioxclient = {};
}

/**
 *  点击图片
 *
 * @stable
*/
Vioxclient.showimage = function (src) {
    debugger
    console.log(src)
}

/**
 *  点击视频
 *
 * @stable
*/
Vioxclient.showvideo = function (src) {
    console.log(src)
}

/**
 *  增加图片点击事件
 *
 * @stable
*/
function AddImgClickEvent() {
    var objs = document.getElementsByTagName("img");
    for (var i = 0; i < objs.length; i++) {
        objs[i].onclick = function (e) {
            window.Vioxclient.showimage(e.target.src)
        }
    }
}

/**
 *  增加视频点击事件 
 *
 * @stable
*/
function AddVideoClickEvent() {
    var objs = document.getElementsByTagName("video");
    for (var i = 0; i < objs.length; i++) {
        objs[i].onclick = function (e) {
            window.Vioxclient.showvideo(e.target.src)
            debugger
        }
    }
}

/**
 *  app 内调用赞赏
 *
 * @stable
*/
 Vioxclient.payMoney =function (){
    debugger
}

/**
 *  app 内调用点赞
 *
 * @stable
*/
 Vioxclient.like = function(){
debugger
}
/**
 *  app 内调用收藏
 *
 * @stable
*/
 Vioxclient.collection = function(){
debugger
}

/**
 *  app 内调用 显示 收藏,点赞,赞赏 图片
 *
 * @stable
*/
Vioxclient.IsApp = function(e) {
    var add
    if (e.collection) {
        add = 'http://viodoc.tpddns.cn:18080/viodoc/M00/00/1B/wKgBylpBuxiAAZ8FAAADoGrsLMU614.jpg';
    } else {
        add = 'http://viodoc.tpddns.cn:18080/viodoc/M00/00/1B/wKgBylpBwk6AcI3zAAARVK6Triw95.jpeg';
    }
    var appitem = `
    <div style="display:inline-block;vertical-align:middle; float:left; " >
     <img  width="30px" height:="30px" src='http://viodoc.tpddns.cn:18080/viodoc/M00/00/1B/wKgBylpBux6AOWX1AAADVZTXXg0954.jpg'>
     <span style="position:relative;top:-10px" >${e.browse}</span>
    </div>
    <div style="display: inline-block;vertical-align:middle " >
     <img onclick = "window.Vioxclient.like()" width="30px" height:="30px" src='http://viodoc.tpddns.cn:18080/viodoc/M00/00/1B/wKgBylpBuxuAVdK_AAAC_v9_daw641.jpg'>
     <span  style="position:relative;top:-10px" >${e.like}</span>
    </div>
    <div style="display:inline-block;vertical-align:middle; float:right " >
     <img onclick = "window.Vioxclient.collection()" width="30px" height:="30px" src=${add}>
    </div>
    <div> 
    <button onclick = "Vioxclient.payMoney()" style="
    width: 120px;
    height: 30px;
    margin: 20px 10px;
    font-size: 14px;
    color:#fff;
    background-color:#2399e5;
    border-radius: 20px;">赞&nbsp赏</button>
    </div>
     `
    var oDiv = document.createElement('div');
    oDiv.id = 'appfunc'
    oDiv.setAttribute('style', 'padding:15px;text-align:center')
    oDiv.innerHTML = appitem;
    document.body.appendChild(oDiv);
}

Vioxclient.delApp = function( ) {
    var box = document.getElementById('appfunc')
    if(box){
        debugger
        box.parentNode.removeChild(box)
    }else{
        console.log('没有这个div')
    }
}

AddImgClickEvent();


var info = { browse: 3333, like: 1111, collection: false }
debugger
Vioxclient.IsApp(info)