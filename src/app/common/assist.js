// import { Message } from 'element-ui'

// uuid-v4
export const generateUUID = () => {
  var d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now()
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

// 滚动到锚点
export const animationToAnchor = (anchorId) => {
  const anchorDiff = 0
  const scrollSpeed = 20

  let TargetScrollY = document.getElementById(anchorId).offsetTop - anchorDiff
  let screenY = Math.floor(window.scrollY)

  // Scroll Down
  if (screenY < TargetScrollY) {
    const downfunc = _ => {
      screenY = (screenY + scrollSpeed) < TargetScrollY ? screenY + scrollSpeed : TargetScrollY
      window.scrollTo(0, screenY)
      downraf = requestAnimationFrame(downfunc)
      screenY >= TargetScrollY && cancelAnimationFrame(downraf)
    }
    let downraf = requestAnimationFrame(downfunc)
  }
  // Scroll Up
  if (screenY > TargetScrollY) {
    const upfunc = _ => {
      screenY = (screenY - scrollSpeed) > TargetScrollY ? screenY - scrollSpeed : TargetScrollY
      window.scrollTo(0, screenY)
      upraf = requestAnimationFrame(upfunc)
      screenY <= TargetScrollY && cancelAnimationFrame(upraf)
    }
    let upraf = requestAnimationFrame(upfunc)
  }
}

export const errorHandle = msg => {
  let obj = Object.prototype.toString.call(msg)
  let toastMsg = (msg) => msg 
  obj === '[object Object]' && toastMsg(msg.message)
  obj === '[object String]' && toastMsg(msg)
  obj === '[object Error]' && (console.error(msg.stack), toastMsg(msg.message))
}

export const fmtDate = (date, fmt) => {
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/* eslint-disable */
function htmlEncode (str) {
  var div = document.createElement('div')
  var text = document.createTextNode(str)
  div.appendChild(text)
  return div.innerHTML
}

function htmlDecode (str) {
  var div = document.createElement('div')
  div.innerHTML = str
  return div.innerHTML
}

function lowGetImgAttribute (str) {
  var div = document.createElement('div')
  div.innerHTML = str
  return {
    src: div.firstChild.src,
    width: div.firstChild.getAttribute('owidth'),
    height: div.firstChild.getAttribute('oheight')
  }
}

function lowGetVideoAttribute (str) {
  var div = document.createElement('div')
  div.innerHTML = str
  return {
    src: div.firstChild.src,
    poster: div.firstChild.poster || '',
    width: div.firstChild.getAttribute('owidth'),
    height: div.firstChild.getAttribute('oheight')
  }
}

/* eslint-enable */

export const parseHtmlToJson = (originHtml) => {
  const enumType = {
    text: 1,
    img: 2,
    video: 3
  }
  function maketTypeAndAttribute (str) {
    let type = enumType.text
    // TODO 获取图片属性
    if (str.includes('<img')) {
      type = enumType.img
    }
    // TODO 获取视频标签属性
    if (str.includes('<video')) {
      type = enumType.video
    }
    return {type}
  }
  const copyHtml = originHtml
  const resJsonList = []
  let error = false
  let errorText = ''
  let processHtml = copyHtml.split('</p>')
  processHtml.forEach(ptext => {
    let pnode = ptext
    let videoImg = ''
    const { type } = maketTypeAndAttribute(pnode)

    let warpContent = pnode.replace('<p>', '')
        warpContent = warpContent.replace(/<br>|&nbsp;/g,'')
    // if(type ===1){
    //   warpContent = warpContent.replace(/<(.*?)>|&nbsp;/g,'')
    // }
    let contentValue = htmlDecode(warpContent)
    let owidth = ''
    let oheight = ''
    const imgList = warpContent.match(/<img[^>]+>/g) || []
    if (imgList.length) {
      if (imgList.length > 1) {
        error = true
        errorText = '一行只允许有一张图片'
      } else if (warpContent.replace(imgList[0], '').trim().length) {
        error = true
        debugger
        // warpContent=''
        errorText = '图片不允许和文字等内容同行,插入图片后请输入回车'
      } else {
        error = false
        errorText = ''
        const { width, height, src } = lowGetImgAttribute(imgList[0])
        contentValue = src
        owidth = width
        oheight = height
      }
    }
    const videoList = warpContent.match(/<video[^]+<\/video>/g) || []
    if (videoList.length) {
      if (videoList > 1) {
        error = true
        errorText = '一行只允许有一个视频'
      } else if (warpContent.replace(videoList[0], '').trim().length) {
        error = true
        errorText = '视频不允许和文字等内容同行,插入图片后请输入回车'
      } else {
        error = false
        errorText = ''
        let videoAttr = lowGetVideoAttribute(videoList[0])
        contentValue = videoAttr.src
        videoImg = videoAttr.poster
        owidth = videoAttr.width
        oheight = videoAttr.height
      }
    }

    if (contentValue === '<br>') {
      contentValue = ''
    }
    resJsonList.push({
      /**
       "contentType": 3,
        "fileFormat": "视频格式",
        "fileName": "视频名称",
        "content": "视频URL",
        "videoImg": "首帧图URL",
        "firstImgName": "首帧图名称",
        "firstImgFormat": "首帧图格式",
        "width": "首帧图宽度",
        "height": "首帧图高度"
       */
      contentType: type,
      content: contentValue,
      width: owidth,
      height: oheight,
      fileFormat: '',
      fileName: '',
      videoImg,
      firstImgName: '',
      firstImgFormat: ''
    })
  })
  return { resJsonList, error, errorText }
}

export const autoMakePWrapHtml = (str) => {
  const imgList = str.match(/<img[^>]+>/g) || []
  imgList.forEach(imgNode => {
    str.replace(imgNode, `</p>${imgNode}<p>`)
  })
  const videoList = str.match(/<video[^]+<\/video>/g) || []
  videoList.forEach(videoNode => {
    str.replace(videoNode, `</p>${videoNode}<p>`)
  })
  return str
}

export const previewHtml = (ariticleArray) => {
  if (!Array.isArray(ariticleArray)) {
    return ''
  }
  const makeP = (section) => {
    return `<p class="article-font"> ${section.content}</p>`
  }
  const makeImg = (section) => {
    return `<p><img class ="article-image" src=${section.content} owidth=${section.width} oheight=${section.height}></p>`
  }
  const makeVideo = (section) => {
    return `<p><video class ="article-video" src=${section.content} controls poster=${section.videoImg} owidth=${section.width} oheight=${section.height}></video></p>`
  }
  const generateHtml = (section) => {
    const EnumType = {
      text: 1, img: 2, video: 3
    }
    let res = ''
    switch (section.contentType) {
      case EnumType.text:
        res = makeP(section)
        break
      case EnumType.img:
        res = makeImg(section)
        break
      case EnumType.video:
        res = makeVideo(section)
        break
    }
    return res
  }
  return ariticleArray.reduce((accurate, node, cc) => {
    accurate += generateHtml(node)
    return accurate
  }, '')
}


export const parseJsonHtml = (ariticleArray) => {
  if (!Array.isArray(ariticleArray)) {
    return ''
  }
  const makeP = (section) => {
    return `<p> ${section.content}</p>`
  }
  const makeImg = (section) => {
    return `<p><img src=${section.content} owidth=${section.width} oheight=${section.height}></p>`
  }
  const makeVideo = (section) => {
    return `<p><video src=${section.content} controls poster=${section.videoImg} owidth=${section.width} oheight=${section.height}></video></p>`
  }
  const generateHtml = (section) => {
    const EnumType = {
      text: 1, img: 2, video: 3
    }
    let res = ''
    switch (section.contentType) {
      case EnumType.text:
        res = makeP(section)
        break
      case EnumType.img:
        res = makeImg(section)
        break
      case EnumType.video:
        res = makeVideo(section)
        break
    }
    return res
  }
  return ariticleArray.reduce((accurate, node, cc) => {
    accurate += generateHtml(node)
    return accurate
  }, '')
}
