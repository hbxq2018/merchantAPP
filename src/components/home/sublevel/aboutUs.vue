<template>
  <div class="aboutMe">
        <mt-header title="关于我们"><router-link slot="left" :to="{path:'home',query:{'ind':index}}">
        <mt-button icon="back"></mt-button></router-link></mt-header>
        <div class="weWrap">
            <img :src="data.src" alt="享7Logo">
            <p>{{data.name}}<span>{{data.versionNumber}}</span></p>
        </div>
        <div class="Our_information" v-for="(item,index) in data1" :key='index' :id="item.id" @click="handlist">
            <div class="Information_details">
                <p>{{item.name}}</p>
                <span>{{item.heEntityName}}</span>
            </div>
        </div>
  </div>
</template>

<script>
import { MessageBox } from "mint-ui";
export default {
  name: "aboutMe",
  data() {
    return {
      index: 2,
      msg: "aboutMe",
      apkUrl: "http://a.app.qq.com/o/simple.jsp?pkgname=io.dcloud.H53DA2BA2",
      apkUrl2:
        "https://xqmp4-1256079679.file.myqcloud.com/test_H567B9652_0731110709.apk",
      wgtVer: "",
      data: {
        //   src: "../../../../static/images/xiang7Logo.png",
        src: require("../../../../static/images/xiang7Logo.png"),
        name: "版本号:",
        versionNumber: "V1.0"
      },
      data1: [
        {
          name: "微信公众号",
          id: 0,
          heEntityName: "享7美食"
        },
        {
          name: "商务合作",
          id: 1,
          heEntityName: "xiangqikeji2018@163.com"
        },
        {
          name: "官方网站",
          id: 3,
          heEntityName: "http://www.xiang7.net"
        },
        {
          name: "检查更新",
          id: 4,
          heEntityName: "当前最新版本"
        }
      ]
    };
  },
  methods: {
    handlist: function(e) {
      let id = e.currentTarget.id;
      if (id == 4) {
        console.log("id:", id);
        this.appUpdate();
      }
    },
    appUpdate: function() {
      mui.plusReady(function() {
        plus.runtime.getProperty(plus.runtime.appid, function(inf) {
          let ver = inf.version,
            newVer = "",apkUrl="";
          if (ver.indexOf("v") != -1) {
            ver = ver.replace("v", "");
          }
          ver *= 1;
          if(version == ver){
              mui.toast("当前版本号已是最新");
              return false
          }
          var btn = ["确定升级"];
          var ua = navigator.userAgent.toLowerCase();
          if (/iphone|ipad|ipod/.test(ua)) {
            //苹果手机
            mui.ajax({
              type: "get",
              dataType: "json",
              url: "https://itunes.apple.com/lookup?id=1387428528", //获取当前上架APPStore版本信息
              data: {
                id: 1387428528 //APP唯一标识ID
              },
              contentType: "application/x-www-form-urlencoded;charset=UTF-8",
              success: function(data) {
                var resultCount = data.resultCount;
                for (var i = 0; i < resultCount; i++) {
                  var normItem = data.results[i].version,
                    _msg = "";
                  if (normItem.indexOf("v") != -1) {
                    normItem = normItem.replace("v", "");
                  }
                  if (normItem > ver) {
                    var _msg = "发现新版本:V" + normItem;
                    //plus.nativeUI.alert("发现新版本:V" + normItem);
                    mui.confirm(_msg, "升级确认", btn, function(e) {
                      if (e.index == 0) {
                        //执行升级操作
                        document.location.href =
                          "https://itunes.apple.com/cn/app/san-gu-hui/id1387428528?mt=8"; //上新APPStore下载地址
                      }
                    });
                    return;
                  }else{
                      mui.toast("当前版本号已是最新");
                       return;
                  }
                }
              }
            });
          } else if (ua.match(/android/i) == "android") {
            //安卓手机
            mui.ajax({
              type: "get",
              dataType: "json",
              url: "https://www.hbxq001.cn/version.txt",
              data: {},
              contentType: "application/x-www-form-urlencoded;charset=UTF-8",
              success: function(data) {
                newVer = data.version * 1;
                apkUrl = data.apkUrl;
                if (newVer > ver) {
                  //mui.toast("发现新版本:V" + data.Data);//获取远程数据库中上新andriod版本号
                  var _msg = "发现新版本:V" + newVer;
                  mui.confirm(_msg, "升级确认", btn, function(e) {
                    if (e.index == 0) {
                      //执行升级操作
                      plus.nativeUI.toast("正在准备环境，请稍后！");
                      var dtask = plus.downloader.createDownload(apkUrl,{},
                        function(d, status) {
                          if (status == 200) {
                            var path = d.filename; //下载apk
                            plus.runtime.install(path); // 自动安装apk文件
                          } else {
                            plus.nativeUI.alert("版本更新失败:" + status);
                          }
                        }
                      );
                      dtask.start();
                    }
                  });
                } else {
                  mui.toast("当前版本号已是最新");
                  return;
                }
              },
              error: function(xhr, type, errerThrown) {
                mui.toast("网络异常,请稍候再试");
              }
            });
          }
        });
      });
    },
    getversion: function() {
      mui.plusReady(function() {
        plus.runtime.getProperty(plus.runtime.appid, function(inf) {
          this.data.versionNumber = inf.version;
          if (this.data.versionNumber.indexOf("v") == -1) {
            this.data.versionNumber = "v" + this.data.versionNumber;
            console.log('versionNumber11111111:',this.data.versionNumber)
          }
        });
      });
    }
  },
  created: function() {
    if(version){
        this.data.versionNumber=version;
    }
    this.getversion();
  }
};
</script>

<style lang="less">
.weWrap {
  width: 100%;
  height: 331px;
  background: #fc5e2d;
  margin-top: -1px;
  img {
    width: 147px;
    height: 147px;
    padding-top: 60px;
  }
  p {
    font-size: 30px;
    color: #ffffff;
  }
}
.Our_information {
  background: #ffffff;
  display: flex;
  justify-content: center;
  .Information_details {
    width: 90%;
    height: 107px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 30px;
    color: #191919;
    b {
      font-size: 36px;
      font-weight: 550;
    }
    span {
      font-size: 30px;
      color: #808080;
    }
  }
}
</style>


