<template>
  <div class="dishes">
    <mt-header :title="name">
        <router-link to="/manage" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
    </mt-header>
    <div class="dishesBox" :style="{'-webkit-overflow-scrolling': scrollMode}">
			<ul id="dishesUl" class="dishesUl" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
				<li class="dishes_list clearfix" v-for="(item,index) in list" :key="index" @click="toAddDishes(item.id)">
					<img class="icon fl" :src="item.picUrl" alt="">
					<div class="text fl">
						<p>{{item.skuName}}</p>
						<p>{{item.skuInfo}}</p>
					</div>
					<div class="arrow fr"></div>
				</li>
			</ul>
    </div>
    <div id="dishesBottom" class="dishesBottom" @click="toAddDishes()">
        <span>+</span>
        <span>添加推荐菜</span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Picker, Toast } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "dishes",
  data() {
    return {
      name: "推荐菜管理",
      list: [],
      page: 1,
      allLoaded: true,
      scrollMode: "auto",
      touchStartY: 0,
      distance: 0,
      topFlag: false,    //是否到顶部
      bottomFlag: false,   //是否到底部
      flag: true    //节流阀
    };
  },
  store,
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo"]),
    getDishList() {
      let _this = this,
        _param = "";
      _param = "shopId=" + this.userInfo.id + "&page=" + this.page + "&rows=8";
      this.$axios.get("/api/app/sku/tsc?" + _param).then(res => {
        if (res.data.code == 0) {
          let lists = res.data.data.list;
          if (_this.page == 1) {
            _this.list = [];
          }
          if (lists && lists.length > 0) {
            for (let i = 0; i < lists.length; i++) {
              _this.list.push(lists[i]);
            }
            if (lists.length < 8) {
              _this.allLoaded = false;
            }
          } else {
            _this.allLoaded = false;
            Toast("暂无数据");
          }
        } else {
          _this.allLoaded = false;
        }
      });
    },
    toAddDishes(id) {
      this.$router.push({ name: "AddDishes", params: {id: id} });
    },
    getScrollTop(){    //获取顶部卷去高度
    　　var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    　　if(document.body){
    　　　　bodyScrollTop = document.body.scrollTop;
    　　}
    　　if(document.documentElement){
    　　　　documentScrollTop = document.documentElement.scrollTop;
    　　}
    　　scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    　　return scrollTop;
    },
    getScrollHeight(){     //盒子总高度
    　　var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    　　if(document.body){
    　　　　bodyScrollHeight = document.body.scrollHeight;
    　　}
    　　if(document.documentElement){
    　　　　documentScrollHeight = document.documentElement.scrollHeight;
    　　}
    　　scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    　　return scrollHeight;
    },
    getWindowHeight(){     //屏幕可视高度
    　　var windowHeight = 0;
    　　if(document.compatMode == "CSS1Compat"){
    　　　　windowHeight = document.documentElement.clientHeight;
    　　}else{
    　　　　windowHeight = document.body.clientHeight;
    　　}
    　　return windowHeight;
    },
    touchStart(e) {
      let dishesUl = document.getElementById("dishesUl");
      let bottomH = document.getElementById("dishesBottom").clientHeight * 1.727;
      this.touchStartY = e.targetTouches[0].pageY;
      if(this.getScrollTop() == 0 && this.flag) {
        this.topFlag = true;
      }else {
        this.topFlag = false;
      }
      if(dishesUl.clientHeight < this.getWindowHeight() - bottomH - 5) {
          this.allLoaded = false;
          this.bottomFlag = false;
      } 
      if(Math.abs(this.getScrollHeight() - this.getScrollTop() - this.getWindowHeight()) < 5 && this.allLoaded) {
        this.bottomFlag = true;
      } else {
        this.bottomFlag = false;
      }
    },
    touchMove(e) {
      let dishesUl = document.getElementById("dishesUl");
      this.distance = Math.ceil(+e.targetTouches[0].pageY - this.touchStartY);
      if(this.distance > 0 && this.topFlag == true && this.flag) {
        if(this.distance > 100) {
          this.distance = 100;
        }
        dishesUl.style.transform = "translate3d(0px, "+ this.distance +"px, 0px)";
      } 
      if(this.distance < 0 && this.bottomFlag == true) {
        if(this.distance < -100) {
          this.distance = -100;
        }
        dishesUl.style.transform = "translate3d(0px, "+ this.distance +"px, 0px)";
      }
    },
    touchEnd() {
      let dishesUl = document.getElementById("dishesUl"), _this = this;
      if(this.distance > 0 && this.topFlag == true && this.flag) {
        this.flag = false;
        let index = 100;
        let timer = setInterval(function() {
          if(index == 0) {
            clearInterval(timer);
            _this.flag = true;
          }
          index--;
          dishesUl.style.transform = "translate3d(0px, "+index+"px, 0px)";
        }, 5);
        this.page = 1;
        this.allLoaded = true;
        this.getDishList();
      } 
      if(this.distance < 0 && this.bottomFlag == true) {
        let index = -100;
        let timer = setInterval(function() {
          if(index == 0) {
            clearInterval(timer);
          }
          index++;
          dishesUl.style.transform = "translate3d(0px, "+index+"px, 0px)";
        }, 5);
        ++this.page;
        this.getDishList();
      }
    }
  },
  created: function() {
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
      &:before {
        content: '加载中..';
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
          }
          p:nth-child(2) {
            width: 460px;
            margin-top: 12px;
            color: #b1b1b1;
            font-size: 22px;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-height: 35px;
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
}
</style>