<template>
  <div class="dishes">
    <mt-header :title="title">
        <router-link :to="backpath" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
    </mt-header>
    <div class="dishesBox" :style="{'-webkit-overflow-scrolling': scrollMode}">
			<ul v-if="list.length>0" id="dishesUl" class="dishesUl" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
				<li class="dishes_list clearfix" v-for="(item,index) in list" :key="index" @click="toAddDishes(index,item.skuName,item.id,item.isSign)">
					<img class="icon fl" :src="item.picUrl" alt="">
					<div class="text fl">
						<p>{{item.skuName}}</p>
						<p>{{item.skuInfo}}</p>
					</div>
          <span class="issign" v-if="type == 2 && item.isSign">已报名</span>
          <div v-if="type == 2 && !item.isSign" :class="index == ind?'dishsel actdishsel':'dishsel'">
                    <span></span>
                </div>
					<div v-if="type == 1" class="arrow fr"></div>
				</li>
			</ul>
      <img v-else class="empty" :src="url" alt="什么都没有">
    </div>
    <div v-show="type == 1 || !type" id="dishesBottom" class="dishesBottom" @click="toAddDishes()">
        <span>+</span>
        <span>添加推荐菜</span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Picker, Toast ,Indicator } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "dishes",
  data() {
    return {
      title: "推荐菜管理",
      list: [],
      url: require('../../../../static/images/zhanweitu.png'),
      type: 1, //1 推荐菜管理   2推荐菜列表  2是在活动（37）中使用
      backpath: "/manage",
      page: 1,
      ind: -1,
      allLoaded: true,
      scrollMode: "auto",
      touchStartY: 0,
      distance: 0,
      topFlag: false, //是否到顶部
      bottomFlag: false, //是否到底部
      flag: true //节流阀
    };
  },
  store,
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo"]),
    getDishList() {
      Indicator.open('数据加载中...');
      let _this = this,
        _param = "";
        // if(this.type == 2){
          _param = "shopId=" + this.userInfo.id +"&actId=37"+ "&page=" + this.page + "&rows=8";
        // }else{
        //   _param = "shopId=" + this.userInfo.id + "&page=" + this.page + "&rows=8";
        // }
      this.$axios.get("/api/app/sku/tsc?" + _param).then(res => {
        if (res.data.code == 0) {
          let lists = res.data.data.list;
          if (lists && lists.length > 0) {
            if (_this.page == 1) {
              _this.list = [];
            }
            for (let i = 0; i < lists.length; i++) {
              _this.list.push(lists[i]);
            }
            Indicator.close();
            if (lists.length < 8) {
              _this.allLoaded = false;
            }
          } else {
            Indicator.close();
            _this.allLoaded = false;
            Toast("暂无数据");
          }
        } else {
          _this.allLoaded = false;
        }
      });
    },
    toAddDishes(val, name, id,isSign) {
      if(this.type ==2){
        if(!isSign){
            this.ind = val;
          this.$router.push({ name: "Actsign", params: { name: name, id: id } });
        }
      }else{
        this.$router.push({ name: "AddDishes", params: { id: id ,isSign:isSign} });
      }
    },


    //获取顶部卷去高度
    getScrollTop() {
      var scrollTop = 0,
        bodyScrollTop = 0,
        documentScrollTop = 0;
      if (document.body) {
        bodyScrollTop = document.body.scrollTop;
      }
      if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop;
      }
      scrollTop =
        bodyScrollTop - documentScrollTop > 0
          ? bodyScrollTop
          : documentScrollTop;
      return scrollTop;
    },
    //盒子总高度
    getScrollHeight() {
      var scrollHeight = 0,
        bodyScrollHeight = 0,
        documentScrollHeight = 0;
      if (document.body) {
        bodyScrollHeight = document.body.scrollHeight;
      }
      if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight;
      }
      scrollHeight =
        bodyScrollHeight - documentScrollHeight > 0
          ? bodyScrollHeight
          : documentScrollHeight;
      return scrollHeight;
    },
    //屏幕可视高度
    getWindowHeight() {
      var windowHeight = 0;
      if (document.compatMode == "CSS1Compat") {
        windowHeight = document.documentElement.clientHeight;
      } else {
        windowHeight = document.body.clientHeight;
      }
      return windowHeight;
    },
    touchStart(e) {
      let dishesUl = document.getElementById("dishesUl");
      let bottomH =
        document.getElementById("dishesBottom").clientHeight * 1.727;
      this.touchStartY = e.targetTouches[0].pageY;
      if (this.getScrollTop() == 0 && this.flag) {
        this.topFlag = true;
      } else {
        this.topFlag = false;
      }
      if (dishesUl.clientHeight < this.getWindowHeight() - bottomH - 5) {
        this.allLoaded = false;
        this.bottomFlag = false;
      }
      
      if (
        Math.abs(
          this.getScrollHeight() - this.getScrollTop() - this.getWindowHeight()
        ) < 5 &&
        this.allLoaded
      ) {
        this.bottomFlag = true;
      } else {
        this.bottomFlag = false;
      }
    },
    touchMove(e) {
      let dishesUl = document.getElementById("dishesUl");
      this.distance = Math.ceil(+e.targetTouches[0].pageY - this.touchStartY);
      if (this.distance > 0 && this.topFlag == true && this.flag) {
        if (this.distance > 100) {
          this.distance = 100;
        }
        dishesUl.style.transform =
          "translate3d(0px, " + this.distance + "px, 0px)";
      }
      if (this.distance < 0 && this.bottomFlag == true) {
        if (this.distance < -100) {
          this.distance = -100;
        }
        dishesUl.style.transform =
          "translate3d(0px, " + this.distance + "px, 0px)";
      }
    },
    touchEnd() {
      let dishesUl = document.getElementById("dishesUl"),
        _this = this;
      if (this.distance > 0 && this.topFlag == true && this.flag) {
        this.flag = false;
        let index = 100;
        let timer = setInterval(function() {
          if (index == 0) {
            clearInterval(timer);
            _this.flag = true;
            _this.distance = 0;
          }
          index--;
          dishesUl.style.transform = "translate3d(0px, " + index + "px, 0px)";
        }, 5);
        this.page = 1;
        this.allLoaded = true;
        this.getDishList();
      }
      if (this.distance < 0 && this.bottomFlag == true) {
        let index = -100;
        let timer = setInterval(function() {
          if (index == 0) {
            clearInterval(timer);
          }
          index++;
          dishesUl.style.transform = "translate3d(0px, " + index + "px, 0px)";
        }, 5);
        ++this.page;
        this.getDishList();
      }
    }
  },
  created: function() {
    this.type = this.$route.query.type;
    if (this.type == 1) {
      this.backpath = "/manage";
      this.title = '推荐菜管理';
    } else if (this.type == 2) {
      this.backpath = "/actsign";
      this.title = '推荐菜列表';
    }
    const ua = navigator.userAgent.toLowerCase();
    if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
      this.scrollMode = "touch";
    }
    this.getDishList();
  }
};
</script>
<style lang="less">
@import url(../../../common/css/common.css);
.dishes {
  height: 100%;
  background-color: #ebebeb;
  .mint-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }
  .dishesBox {
    width: 100%;
    padding: 81px 0 110px 0;
    box-sizing: border-box;
    .dishesUl {
      width: 100%;
      position: relative;
      background-color: #ebebeb;
      &:before {
        content: "加载中..";
        position: absolute;
        left: 0;
        top: -50px;
        height: 20px;
        width: 100%;
      }
      .dishes_list {
        height: 170px;
        width: 100%;
        background-color: #fff;
        padding: 20px 30px;
        box-sizing: border-box;
        margin-bottom: 20px;
        .issign{
          position: relative;
          top: 50px;
          color: #fc5e2d;
        }
        .icon {
          width: 130px;
          height: 130px;
          margin-right: 20px;
        }
        .text {
          text-align: left;
          color: #191919;
          p:nth-child(1) {
            font-size: 36px;
            font-weight: 600;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 420px;
          }
          p:nth-child(2) {
            width: 460px;
            height: 70px;
            margin-top: 12px;
            color: #b1b1b1;
            font-size: 22px;
            line-height: 35px;
            // text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
        .arrow {
          position: relative;
          width: 30px;
          height: 30px;
          margin-top: 50px;
          &:before,
          &:after {
            position: absolute;
            top: 0;
            content: "";
            display: block;
            border-top: 15px solid transparent;
            border-right: 15px solid transparent;
            border-bottom: 15px solid transparent;
          }
          &:before {
            left: 5px;
            border-left: 15px solid #b1b1b1;
          }
          &:after {
            left: 0px;
            border-left: 15px solid #fff;
          }
        }
      }
    }
  }
  .dishesBottom {
    vertical-align: middle;
    position: fixed;
    left: 0;
    bottom: 0;
    height: 110px;
    line-height: 110px;
    width: 100%;
    color: #fc5e2d;
    font-size: 30px;
    text-align: center;
    background-color: #fff;
    border-top: 1px solid #efefef;
    span {
      vertical-align: middle;
      display: inline-block;
      height: 110px;
      line-height: 110px;
    }
    span:first-child {
      font-size: 60px;
    }
  }
  .dishsel {
    float: right;
    margin-top: 50px;
    margin-right: 20px;
    display: block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid #fc5e2d;
  }
  .actdishsel {
    background: #fc5e2d;
  }
}
</style>