<template>
    <div class="moving">
        <mt-header fixed class="movheader">
          <mt-button :class="isheader==1?'headerbut headerbut_active':'headerbut'" slot="left" @click="handHeader(1)">全部</mt-button>
          <mt-button :class="isheader==2?'headerbut headerbut_active':'headerbut'" slot="left" @click="handHeader(2)">视频</mt-button>
          <mt-button :class="isheader==3?'headerbut headerbut_active':'headerbut'" slot="left" @click="handHeader(3)">文章</mt-button> 
          <span slot="right" @click="handadd"><img class="addact" :src="addImg" alt="添加动态"></span>
        </mt-header>

        <mt-popup
          v-model="popupVisible"
          popup-transition="popup-fade">
          <div class="modalPopup">
              <p @click="handpopup(1)">发文章</p>
              <p @click="handpopup(2)">发视频</p>
          </div>
        </mt-popup>
        <!-- <div id="mofillimg" class="mofillimg"></div> -->


        <div class="loadBottom mocontent" :style="{'-webkit-overflow-scrolling': scrollMode}">
            <!-- <div v-if="listData.length>0" id="moving"  class="movingBox" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"> -->
            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="movmore">
              <ul v-if="listData.length>0">
                <li class="contentList" v-for="(item,index) in listData" :key="index">
                    <div class="listTop">
                        <img class="userHead" :src="item.iconUrl" alt="用户头像">
                        <p class="userName">{{!item.nickName || item.nickName ==null || item.nickName =='null'?item.userName:item.nickName}}</p>
                        <p class="listOter"><span>{{item.interval}}</span><span>浏览：{{item.viewNum}}</span> <span>评论：{{item.commentNum}}</span></p>
                        <div class="dellist" :id="item.id" @click="handdel(item.id)"><img :src="delImg" alt="删除"></div>
                    </div>
                    <div class="listcont" @click="handplay(item.id,item.topicType)">
                      <div class="listCover">
                        <img :src="item.homePic" alt="动态封面图">
                      </div>
                      <div :class="item.topicType == 2?'listModal':'listModal noshow'" >
                          <img class="playIcon" :src="playIcon" alt="播放图标">
                      </div>
                      <div class="listText">{{item.summary | uncodeUtf16}}</div>
                    </div>
                </li>
                <div class="ulbottom"></div>
              </ul>
               <img v-else class="empty" src="../../../static/images/zhanweitu.png" alt="空空如也">
            </mt-loadmore>
        </div> 
    </div>
</template>

<script>
import Vue from "vue";
import { Popup, Toast, MessageBox, Loadmore, Indicator } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
Vue.component(Popup.name, Popup);
export default {
  name: "Moving",
  data() {
    return {
      isheader: 1,
      page: 1,
      scrollMode: "auto",
      distance: 0,
      allLoaded: false,
      flag: true, //节流阀
      topicType: "",
      delImg: require("../../../static/images/more.png"),
      addImg: require("../../../static/images/addact.png"),
      popupVisible: false,
      listData: [],
      playIcon: "https://xq-1256079679.file.myqcloud.com/test_播放_0.3.jpg"
    };
  },
  store,
  filters: {
    uncodeUtf16:function(str) {  //反解开EMOJI编码后的字符串   与上对应使用
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
  },
  computed: {
    ...mapState(["shopInfo","userInfo"])
  },
  methods: {
    //点击头部按钮
    handHeader: function(val) {
      if (val == 1) {
        //查询全部数据
        this.topicType = "";
      } else if (val == 2) {
        //查询视频数据
        this.topicType = 2;
      } else if (val == 3) {
        //查询文章数据
        this.topicType = 1;
      }
      this.isheader = val;
      this.page = 1;
      this.allLoaded = false;
      this.getlist();
    },
    //点击加号+
    handadd: function() {
      this.popupVisible = true;
    },
    //点击视频开始播放
    handplay: function(val, type) {
      if (type == 1) {
        this.$router.push({ name: "Article", params: { id: val } });
      }else if(type == 2){
        this.$router.push({ name: "VideoDateil", params: { id: val } });
      }
    },
    //进入编辑页面
    handpopup: function(val) {
      this.popupVisible = false;
      this.$router.push({ name: "AddVideo", params: { _type: val } });
    },
    //删除某条动态数据
    handdel: function(id) {
      MessageBox.confirm("是否确认删除？").then(action => {
        if (action == "confirm") {
          this.$axios.get("/api/app/topic/delete/" + id).then(res => {
            if (res.data.code == "0") {
              Toast("删除成功！");
              this.page = 1;
              this.loadTop();
            }
          });
        }
      });
    },
    //获取列表数据
    getlist: function() {
      Indicator.open('数据加载中...');
      let _parms = {
          shopId: this.userInfo.id,
          page: this.page,
          rows: 10
        },
        _value = "",
        oldData = [],
        isSuccess = false;
      if (this.topicType) {
        _parms.topicType = this.topicType;
      }
      for (var key in _parms) {
        _value += key + "=" + _parms[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      setTimeout(() => {
        if(!isSuccess){
          isSuccess = false;
          Indicator.close();
          Toast("网络异常，请检查网络连接")
        }
      }, Delay);
      this.$axios.get("/api/app/topic/myList?" + _value).then(res => {
        Indicator.close();
        isSuccess = true;
        if (res.data.code == 0) {
          if (this.page == 1) {
            this.listData = [];
          }
          oldData = this.listData;
          if (res.data.data.list && res.data.data.list.length > 0) {
            let _listData = res.data.data.list,
              reg = /^1[345678][0-9]{9}$/;
            for (let i in _listData) {
              _listData[i].interval = this.timeDiffrence(
                _listData[i].createTime,
                _listData[i].updateTime
              );
              if (_listData[i].nickName && reg.test(_listData[i].nickName)) {
                _listData[i].nickName =
                  _listData[i].nickName.substr(0, 3) +
                  "****" +
                  _listData[i].nickName.substr(7);
              }
              if (_listData[i].userName && reg.test(_listData[i].userName)) {
                _listData[i].userName =
                  _listData[i].userName.substr(0, 3) +
                  "****" +
                  _listData[i].userName.substr(7);
              }
              oldData.push(_listData[i]);
            }
            this.listData = oldData;
          } else {
             this.allLoaded = true; // 若数据已全部获取完毕
          }
        }
      });
    },
    //文章发布时间  updateTime
    timeDiffrence: function(current, updateTime, createTime) {
      let createT = "",
        timestamp = 0,
        str = "暂无";
      updateTime = updateTime ? updateTime.replace(/-/g, "/") : "";
      updateTime = updateTime ? updateTime : createTime;
      if (updateTime != null && updateTime != "") {
        createT = new Date(updateTime).getTime();
        current = new Date().getTime();
        timestamp = (+current - createT) / 1000;
        if (timestamp / 31536000 > 1 || timestamp / 31536000 == 1) {
          str = Math.floor(timestamp / 60 / 60 / 24 / 365) + "年前";
        } else if (timestamp / 2592000 > 1 || timestamp / 2592000 == 1) {
          str = Math.floor(timestamp / 60 / 60 / 24 / 30) + "个月前";
        } else if (timestamp / 86400 > 1 || timestamp / 86400 == 1) {
          str = Math.floor(timestamp / 60 / 60 / 24) + "天前";
        } else if (timestamp / 3600 > 1 || timestamp / 3600 == 1) {
          str =
            Math.floor(timestamp / 60 / 60) +
            "小时" +
            Math.floor((timestamp % 3600) / 60) +
            "分钟前";
        } else if (timestamp / 60 > 1 || timestamp / 60 == 1) {
          str = Math.floor(timestamp / 60) + "分钟前";
        } else {
          str = "刚刚发布";
        }
      }
      return str;
    },
     //下拉
    loadTop() {
      this.page = 1;
      this.allLoaded = false;
      this.listData = [];
      this.getlist();
      this.$refs.movmore.onTopLoaded();
    },
    //上拉
    loadBottom() {
      this.page += 1;
      this.getlist();
      this.$refs.movmore.onBottomLoaded();
    }
  },
  created: function() {
    const ua = navigator.userAgent.toLowerCase();
    if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
      this.scrollMode = "touch";
    }
    this.getlist();
  }
};
</script>

<style lang="less">
.moving {
  padding-bottom: 100px;
  .header{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }
  .movheader {
    color: #fff;
    z-index: 999;
    & > span {
      font-size: 40px;
    }
    .addact{
      width: 35px;
      height: 35px;
      position: relative;
      top: 5px;
    }
    .headerbut {
      margin-right: 140px;
      height: 80%;
      margin-top: 1%;
      padding-bottom: 10px;
    }
    .headerbut_active {
      border-bottom: 4px solid #fff;
    }
  }
  .modalPopup {
    position: absolute;
    top: -580px;
    right: -750px;
    width: 162px;
    height: 191px;
    background: rgba(255, 255, 255, 1);
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(170, 165, 165, 1);
    p {
      width: 100%;
      height: 85px;
      line-height: 95px;
    }
    p:nth-child(1) {
      border: 1px solid rgba(224, 224, 224, 1);
    }
  }
  .mofillimg{
    width: 100%;
    height: 0px;
  }
  .mocontent {
    padding-top: 80px;
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background: RGBA(245, 245, 250, 1);
    .empty{
      width: 50%;
      margin-top: 40%;
    }
    .movingBox {
        &:before {
          content: "加载中...";
          position: absolute;
          left: 0;
          top: -50px;
          height: 20px;
          width: 100%;
        }
        .loadingBox {
          background-color: #ebebeb;
          text-align: center;
          height: 30px;
          line-height: 30px;
          width: 100%;
          padding: 0;
          margin: 0;
          display: block;
          position: relative;
          bottom: -30px;
          left: 0;
        }
      }
    .contentList {
      width: 694px;
      height: 643px;
      padding: 0 28px;
      margin-bottom: 20px;
      background: #fff;
      position: relative;
      .listcont{
        overflow: hidden;
        height: 543px;
      }
      .listTop {
        width: 100%;
        height: 68px;
        padding: 28px 0;
        .userHead {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          margin-right: 18px;
          float: left;
        }
        .userName,
        .listOter {
          height: 34px;
          line-break: 34px;
          color: RGBA(25, 25, 25, 1);
          font-size: 28px;
          text-align: left;
        }
        .listOter {
          color: RGBA(177, 177, 177, 1);
          font-size: 24px;
          span {
            margin-right: 29px;
          }
        }
        .dellist {
          width: 60px;
          height: 60px;
          position: relative;
          top: -60px;
          right: -650px;
          transform: rotate(90deg);
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .listCover,
      .listModal {
        width: 100%;
        height: 390px;
        margin: 0;
        z-index: 1;
      }
      .listCover{
        overflow: hidden;
        background: #000;
        &>img{
          width:auto;
          height:100%;
        }
      }
      .noshow{
        z-index: -1;
      }
      .listModal {
        position: relative;
        top: -390px;
        width: 694px;
        border-radius: 8%;
        background: rgba(25, 25, 25, 1);
        opacity: 0.5;
        border-radius: 8px;
        .playIcon {
          position: relative;
          widows: 80px;
          height: 80px;
          border-radius: 50%;
          top: 155px;
          z-index:1;
        }
      }
      .listText {
        margin: 23px 0;
        position: relative;
        top: -400px;
        color: RGBA(25, 25, 25, 1);
        font-size: 32px;
        text-align: left;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
    .ulbottom{
      width: 100%;
      height: 110px;
      background:none;
    }
  }
}
</style>


