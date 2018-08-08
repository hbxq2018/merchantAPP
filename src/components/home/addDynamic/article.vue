<template>
    <div class="articlBox">
        <mt-header fixed title="文章详情">
            <router-link :to="{path:'/home',query:{ind:3}}" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="artcontent">
            <h3 class="title">{{artData.title | uncodeUtf16}}</h3>
            <p>{{artData.nickName?artData.nickName:artData.userName}}</p>
            <div class="artdetail" v-html="artData.content"></div>

            <div class="tnumber">
                <span> <img src="../../../../static/images/tuoyuan_w.png" alt="浏览量">{{artData.hitNum}} </span>
                <span>{{artData.zan}}
                    <img v-if="artData.zan" src="../../../../static/images/home_zaned.png" alt="点赞数">
                    <img v-else src="../../../../static/images/home_zan.png" alt="点赞数">
                </span>
            </div>


            <div class="line_02"><span>评论</span></div>

            <div class="comment" v-for="(item,index) in comList" :key="index">
                <div class="com_left">
                    <img :src="item.userPic" alt="用户头像">
                </div>
                <div class="com_right">
                    <p class="comname"> <span>{{item.nickName?item.nickName:item.userName}}</span>
                    <span>{{item.zan}}
                        <img v-if="item.zan" src="../../../../static/images/home_zaned.png" alt="点赞数">
                        <img v-else src="../../../../static/images/home_zan.png" alt="点赞数">
                    </span></p>
                    <div class="com_content">{{item.content}}</div>
                    <p class="comdate">{{item.createTime}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
export default {
  name: "articlBox",
  data() {
    return {
      artId: "",
      artData: {},
      comList: []
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
    ...mapState(["shopInfo"])
  },
  methods: {
    getdata: function() {
      let _parms = {
          id: this.artId,
          zanUserId: this.shopInfo.id,
          zanUserName: this.shopInfo.userName,
          zanSourceType: 1
        },
        _value = "",
        reg = /^1[34578][0-9]{9}$/;
      for (var key in _parms) {
        _value += key + "=" + _parms[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      this.$axios.get(this.$GLOBAL.API+"app/topic/getTopicByZan?" + _value).then(res => {
        if (res.data.code == "0") {
          let _Data = res.data.data;

          if (_Data.nickName && reg.test(_Data.nickName)) {
            _Data.nickName =
              _Data.nickName.substr(0, 3) + "****" + _Data.nickName.substr(7);
          }
          if (_Data.userName && reg.test(_Data.userName)) {
            _Data.userName =
              _Data.userName.substr(0, 3) + "****" + _Data.userName.substr(7);
          }

          _Data.content = _Data.content.replace(
            /\<img/gi,
            '<img style="max-width:100%;height:auto"'
          );

          this.artData = _Data;
        }
      });
    },
    //获取评论数据
    getcomdata: function() {
      let _parms = {
          zanUserId: this.shopInfo.id,
          refId: this.artId,
          cmtType: "2"
        },
        _value = "",
        reg = /^1[34578][0-9]{9}$/;
      for (var key in _parms) {
        _value += key + "=" + _parms[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      this.$axios.get(this.$GLOBAL.API+"app/cmt/list?" + _value).then(res => {
        if (res.data.code == 0) {
          let _Data = res.data.data.list;
          for (let i in _Data) {
            if (_Data[i].nickName && reg.test(_Data[i].nickName)) {
              _Data[i].nickName =
                _Data[i].nickName.substr(0, 3) +
                "****" +
                _Data[i].nickName.substr(7);
            }
            if (_Data[i].userName && reg.test(_Data[i].userName)) {
              _Data[i].userName =
                _Data[i].userName.substr(0, 3) +
                "****" +
                _Data[i].userName.substr(7);
            }
            let arr = _Data[i].createTime.split(" ");
            _Data[i].createTime = arr[0];
          }
          this.comList = _Data;
        }
      });
    }
  },
  created: function() {
    if (this.$route.params.id) {
      this.artId = this.$route.params.id;
      this.getdata();
      this.getcomdata();
    }
  }
};
</script>

<style lang="less">
.articlBox {
  .artcontent {
    width: 694px;
    word-break: break-all;
    padding: 30px 28px;
    padding-top: 90px;
    h3 {
      font-size: 40px;
    }
    .artdetail {
      margin-top: 30px;
    }
    .line_02 {
      height: 1px;
      border-top: 1px solid #ddd;
      text-align: center;
      margin: 36px 0;
      span {
        position: relative;
        top: -14px;
        background: #ffffff;
        padding: 0 20px;
      }
    }
    .comment {
      width: 100%;
      height: 190px;
      margin-top: 25px;
      .com_left {
        width: 54px;
        height: 100%;
        float: left;
        margin-right: 20px;
        & > img {
          width: 54px;
          height: 54px;
          border-radius: 50%;
        }
      }
      .com_right {
        float: left;
        width: 620px;
        text-align: left;
        border-bottom: 1px solid rgba(224, 224, 224, 1);
        .comname {
          height: 34px;
          line-height: 34px;
          padding: 10px 0;
          color: RGBA(128, 128, 128, 1);
          font-size: 28px;
          span:nth-child(2) {
            float: right;
            img {
              width: 34px;
              height: 34px;
              margin-left: 15px;
            }
          }
        }
        .comdate {
          text-align: left;
          padding: 24px 0;
          color: RGBA(177, 177, 177, 1);
          font-size: 24px;
        }
        .com_content {
          height: 65px;
          color: RGBA(25, 25, 25, 1);
          font-size: 24px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }
    }
    .tnumber {
      width: 100%;
      height: 30px;
      margin: 30px 0;
      span {
        img {
          width: 28px;
          height: 25px;
        }
      }
      & > span:nth-child(1) {
        float: left;
        img {
          margin-right: 9px;
        }
      }
      & > span:nth-child(2) {
        float: right;
        img {
          margin-left: 9px;
        }
      }
    }
  }
}
</style>



