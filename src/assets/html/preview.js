if (typeof(window.Vioxclient) == "undefined")
    {
    window.Vioxclient = {};
    }

Vioxclient.showimage=function(src){
    debugger
    console.log(src)
}
Vioxclient.shoevideo = function(src){
    console.log(src)
}
function AddImgClickEvent()  
{  
    var objs = document.getElementsByTagName("img");             
    for(var i=0;i<objs.length;i++)  
    {  
        objs[i].onclick=function(e)  
        {  
            window.Vioxclient.showimage(e.target.src)
        }  
    }  
}  

function AddVideoClickEvent(){
    var objs = document.getElementsByTagName("video");             
    for(var i=0;i<objs.length;i++)  
    {  
        objs[i].onclick=function(e)  
        {  
            window.Vioxclient.shoevideo(e.target.src)
            debugger
        }  
    }  
}
AddImgClickEvent(); 