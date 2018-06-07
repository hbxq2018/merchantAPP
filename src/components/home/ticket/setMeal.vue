<template>
  <div class="setMeal">
    <mt-header :title="name">
        <router-link to="/promotion" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
    </mt-header>
    <div id="setMealBox" class="setMealBox" :style="{'-webkit-overflow-scrolling': scrollMode}">
        <ul id="setMealUl" class="setMealUl" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
            <li class="setMeal_list clearfix" v-for="(item,index) in list" :key="index" :id="item.id" @click="toSetMeal(item.id)">
                <img class="icon fl" :src="item.picUrl" alt="">
                <div class="text fl">
                    <p>{{item.skuName}}</p>
                    <p>
                        <span>折后价 ￥{{item.agioPrice}}元</span>
                        <span>门市价 ￥{{item.sellPrice}}元</span>
                    </p>
                    <p>发布日期：{{item.updateTime}}</p>
                </div>
                <div class="arrow fr"></div>
            </li>
        </ul>
    </div>
    <div id="setMealBottom" class="setMealBottom" @click="toSetMeal()">
        <span>+</span>
        <span>添加套餐</span>
    </div>
  </div>
</template>

<script>
import { Picker,Toast } from "mint-ui";
import store from '@/vuex/store'
import {mapState,mapMutations,mapGetters} from 'vuex'
export default {
  name: "setMeal",
  data() {
    return {
      name: "套餐",
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
  computed:{
    ...mapState(['userInfo','shopId']),
  },
  methods: {
     ...mapMutations(['setuserInfo']),
     setMealList() {
        let _this = this, _param = "";
        _param = "shopId=" + this.userInfo.id + "&page=" + this.page + "&rows=8" 
        this.$axios.get("/api/app/sku/agioList?" + _param).then(res => {
            if (res.data.code == 0) {
                let lists = res.data.data.list;
                if(_this.page == 1) {
                    _this.list = [];
                }
                if(lists && lists.length > 0) {
                    for(let i = 0; i < lists.length; i++) {
                        lists[i].updateTime = _this.switchDate(lists[i].updateTime);
                        _this.list.push(lists[i]);
                    }
                    if(lists.length < 8) {
                        _this.allLoaded = false;
                    }
                } else {
                    _this.allLoaded = false;
                    Toast('暂无数据');
                }
            } 
            else {
                _this.allLoaded = false;
            }
        });
    },
    toSetMeal(id) {
        this.$router.push({ name: "ToSetMeal", params: {id: id} });
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
    getWindowHeight() {     //屏幕可视高度
    　　var windowHeight = 0;
    　　if(document.compatMode == "CSS1Compat"){
    　　　　windowHeight = document.documentElement.clientHeight;
    　　}else{
    　　　　windowHeight = document.body.clientHeight;
    　　}
    　　return windowHeight;
    },
    touchStart(e) {
      let setMealUl = document.getElementById("setMealUl");
      let bottomH = document.getElementById("setMealBottom").clientHeight * 1.727;
      this.touchStartY = e.targetTouches[0].pageY;
      if(this.getScrollTop() == 0 && this.flag) {
        this.topFlag = true;
      }else {
        this.topFlag = false;
      }
      if(setMealUl.clientHeight < this.getWindowHeight() - bottomH - 5) {
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
      let setMealUl = document.getElementById("setMealUl");
      this.distance = Math.ceil(+e.targetTouches[0].pageY - this.touchStartY);
      if(this.distance > 0 && this.topFlag == true && this.flag) {
        if(this.distance > 100) {
          this.distance = 100;
        }
        setMealUl.style.transform = "translate3d(0px, "+ this.distance +"px, 0px)";
      } 
      if(this.distance < 0 && this.bottomFlag == true) {
        if(this.distance < -100) {
          this.distance = -100;
        }
        setMealUl.style.transform = "translate3d(0px, "+ this.distance +"px, 0px)";
      }
    },
    touchEnd() {
      let setMealUl = document.getElementById("setMealUl"), _this = this;
      if(this.distance > 0 && this.topFlag == true && this.flag) {
        this.flag = false;
        let index = 100;
        let timer = setInterval(function() {
          if(index == 0) {
            clearInterval(timer);
            _this.flag = true;
            _this.distance = 0;
          }
          index--;
          setMealUl.style.transform = "translate3d(0px, "+index+"px, 0px)";
        }, 5);
        this.page = 1;
        this.allLoaded = true;
        this.setMealList();
      } 
      if(this.distance < 0 && this.bottomFlag == true) {
        let index = -100;
        let timer = setInterval(function() {
          if(index == 0) {
            clearInterval(timer);
          }
          index++;
          setMealUl.style.transform = "translate3d(0px, "+index+"px, 0px)";
        }, 5);
        ++this.page;
        this.setMealList();
      }
    },
    switchDate(s) {    //转换日期
        let dateStr = new Date(s);
        let yearStr = dateStr.getFullYear();
        let monthStr = +dateStr.getMonth() + 1;
        let dayStr = dateStr.getDate() > 9 ? dateStr.getDate() : "0" + dateStr.getDate();
        monthStr = monthStr > 9 ? monthStr : "0" + monthStr;
        return yearStr + "-" + monthStr + "-" + dayStr;
    }
  },
  created: function() {
    const ua = navigator.userAgent.toLowerCase();
    if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
      this.scrollMode = "touch";
    }
    this.setMealList();
  }
};
</script>
<style lang="less">
@import url(../../../common/css/common.css);
.setMeal {
    height: 100%;
    background-color: #ebebeb;
    .mint-header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
    }
    .setMealBox {
        width: 100%;
        padding: 81px 0 110px 0;
        box-sizing: border-box;
        .setMealUl {
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
            .setMeal_list {
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
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        width: 420px;
                    }
                    p:nth-child(2) {
                        margin-top: 12px;
                        span:nth-child(1) {
                            color: #FF5252;
                            font-size: 30px;
                        }
                        span:nth-child(2) {
                            color: #555555;
                            font-size: 24px;
                        }
                    }
                    p:nth-child(3) {
                        color: #B1B1B1;
                            font-size: 22px;
                    }
                }
                .arrow {
                    position: relative;
                    width: 30px;
                    height: 30px;
                    margin-top: 50px;
                    &:before, &:after {
                        position: absolute;
                        top: 0;
                        content: '';
                        display: block;
                        border-top: 15px solid transparent;
                        border-right: 15px solid transparent;
                        border-bottom: 15px solid transparent;
                    }
                    &:before {
                        left: 5px;
                        border-left: 15px solid #B1B1B1;
                    }
                    &:after {
                        left: 0px;
                        border-left: 15px solid #fff;
                    }
                }
            }
        }
    }
    .setMealBottom {
        vertical-align: middle;
        position: fixed;
        left: 0;
        bottom: 0;
        height: 110px;
        line-height: 110px;
        width: 100%;
        color: #FC5E2D;
        font-size: 30px;
        text-align: center;
        background-color: #fff;
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