var config = require('./config/config.js');
import { myStore } from './tools/store';
import { tools } from './tools/tools';

function imgSrcToBase64(img) { //将图片转为base64格式
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img,0,0,img.width,img.height);

  return canvas.toDataURL();
}

function base64ToBlob(urlData) { //将base64格式转为图片
  var arr = urlData.split(',');
  var mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
  // 去掉url的头，并转化为byte
  var bytes = window.atob(arr[1]);
  // 处理异常,将ascii码小于0的转换为大于0
  var ab = new ArrayBuffer(bytes.length);
  // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
  var ia = new Uint8Array(ab);
  
  for (var i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
  }

  return new Blob([ab], {
      type: mime
  });
}

function getNowFormatDate() {  //yyyy-MM-dd HH:MM:SS”
  var date = new Date();
  var seperator1 = "/";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  return currentdate;
}

//计算距离 纬度 经度 返回单位米
function calcDistance(lat1, lng1, lat2, lng2) {
  var dis = 0;
  var radLat1 = lat1 * Math.PI / 180;
  var radLat2 = lat2 * Math.PI / 180;
  var deltaLat = radLat1 - radLat2;
  var deltaLng = lng1 * Math.PI / 180 - lng2 * Math.PI / 180;
  var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
  return dis * 6378137;
}

//换算长度 低于1000返回米，否则返回公里
function transformLength(len) {
  if (!len || Math.abs(len) <= 0.000001) {
    return "0m";
  }
  if (len < 1000) {
    return '< ' + len.toFixed(0) + "m";
  }
  else {
    return '< ' + (len / 1000).toFixed(2) + "km";
  }
}


//获取本地视频地址及播放时长
function getFileURL(file) {
  //获取视频本地地址
  var getUrl = null,duration='';
  if (window.createObjectURL != undefined) { // basic
    getUrl = window.createObjectURL(file);
  } else if (window.URL != undefined) { // mozilla(firefox)
    getUrl = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) { // webkit or chrome
    getUrl = window.webkitURL.createObjectURL(file);
  }

  if (getUrl) {
    videoId.src = getUrl;
    setTimeout(function () {
      //获取视频时长
      duration = videoId.duration;
    }, 1000)
  }
}

function utf16toEntities(str) {  //将emoji表情转为字符进行存储 
  var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则 
  str = str.replace(patt, function (char) {
    var H, L, code;
    if (char.length === 2) {
      H = char.charCodeAt(0); // 取出高位 
      L = char.charCodeAt(1); // 取出低位 
      code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法 
      return "&#" + code + ";";
    } else {
      return char;
    }
  });
  return str;
}

function uncodeUtf16(str) {  //反解开EMOJI编码后的字符串   与上对应使用
  var reg = /\&#.*?;/g;
  var result = str.replace(reg, function (char) {
    var H, L, code;
    if (char.length == 9) {
      code = parseInt(char.match(/[0-9]+/g));
      H = Math.floor((code - 0x10000) / 0x400) + 0xD800;
      L = (code - 0x10000) % 0x400 + 0xDC00;
      return unescape("%u" + H.toString(16) + "%u" + L.toString(16));
    } else {
      return char;
    }
  });
  return result;
}

function timeDiffrence(current, updateTime, createTime) {      //文章发布时间  updateTime
  let createT = '', timestamp = 0, str = '暂无';
  updateTime = updateTime ? updateTime.replace(/-/g, "/") : '';
  updateTime = updateTime ? updateTime : createTime;
  if (updateTime != null && updateTime != '') {
    createT = new Date(updateTime).getTime();
    timestamp = (+current - createT) / 1000;
    if (timestamp / 31536000 > 1 || timestamp / 31536000 == 1) {
      str = Math.floor(timestamp / 60 / 60 / 24 / 365) + '年前';
    } else if (timestamp / 2592000 > 1 || timestamp / 2592000 == 1) {
      str = Math.floor(timestamp / 60 / 60 / 24 / 30) + '个月前';
    } else if (timestamp / 86400 > 1 || timestamp / 86400 == 1) {
      str = Math.floor(timestamp / 60 / 60 / 24) + '天前';
    } else if (timestamp / 3600 > 1 || timestamp / 3600 == 1) {
      str = Math.floor(timestamp / 60 / 60) + '小时' + Math.floor((timestamp % 3600) / 60) + '分钟前';
    } else if (timestamp / 60 > 1 || timestamp / 60 == 1) {
      str = Math.floor(timestamp / 60) + '分钟前';
    } else {
      str = '刚刚发布';
    }
  }
  return str;
}
function million(num) {    //数字过万处理
  return num > 9999 ? (Math.floor(num / 1000) / 10) + '万+' : num
}

//判断值是否为空
function isNull(value) {
  if (value == 'null' || value == null || value == '' || value == undefined) {
    return false;
  }
  return true;
}

//时间间隔
function dateConv(dateStr) {
  let year = dateStr.getFullYear(),
    month = dateStr.getMonth() + 1,
    today = dateStr.getDate();
  month = month > 9 ? month : "0" + month;
  today = today > 9 ? today : "0" + today;
  return year + "/" + month + "/" + today;
}



const methods = {
  calcDistance: calcDistance,
  transformLength: transformLength,
  utf16toEntities: utf16toEntities,
  uncodeUtf16: uncodeUtf16,
  timeDiffrence: timeDiffrence,
  store: myStore,
  tools: tools,
  million: million,
  getNowFormatDate: getNowFormatDate,
  isNull: isNull,
  dateConv: dateConv
}

export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};
function padLeftZero(str) {
  return ('00' + str).substr(str.length);
};

export default methods;
