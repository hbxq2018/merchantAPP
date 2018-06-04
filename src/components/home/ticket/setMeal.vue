<template>
  <div class="setMeal">
    <mt-header :title="name">
        <router-link to="/promotion" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
    </mt-header>
    <div class="setMealBox" :style="{'-webkit-overflow-scrolling': scrollMode}">
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="loadmore">
			<ul id="setMealUl" class="setMealUl">
                <div class="setMeal_list clearfix" v-for="(item,index) in list" :key="index" :id="item.id" @click="toSetMeal(item.id)">
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
                </div>
            </ul>
		</mt-loadmore>
    </div>
    <div class="setMealBottom" @click="toSetMeal()">
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
      allLoaded: false,
      scrollMode: "auto"
    };
  },
  store,
  computed:{
    ...mapState(['userInfo','shopId']),
  },
  methods: {
     ...mapMutations(['setuserInfo']),
     setMealList(type) {
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
                    // setTimeout(function() {
                    //     var setMealUl = document.getElementById('setMealUl');
                    //     var height = setMealUl.getElementsByClassName('setMeal_list')[0].offsetHeight;
                    //     setMealUl.style.height = Math.ceil((height / 210) * 230 + 2) * _this.list.length + "px";
                    // },2000);
                    if(lists.length < 8) {
                        _this.allLoaded = true;
                    }
                } else {
                    _this.allLoaded = true;
                    Toast('暂无数据');
                }
                if(type == 'top'){
                    _this.$refs.loadmore.onTopLoaded();
                }else if(type == 'bot'){
                    _this.$refs.loadmore.onBottomLoaded();
                }
                console.log(_this.allLoaded)
            } 
            else {
                _this.allLoaded = true;
            }
        });
    },
    loadTop() {
      //下拉加载
      this.page = 1;
      this.allLoaded = false;
      this.setMealList("top");
    },
    loadBottom() {
      // 上拉加载
      console.log("上拉");
      ++this.page;
      this.setMealList("bot");
    },
    toSetMeal(id) {
        this.$router.push({ name: "ToSetMeal", params: {id: id} });
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
    .mint-header {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
    }
    .setMealBox {
        min-height: 1300px;
        width: 100%;
        background-color: #ebebeb;
        padding: 81px 0 110px 0;
        box-sizing: border-box;
        overflow: scroll;
        .setMealUl {
            width: 100%;
            min-height: 1100px;
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
                        // margin-top: 10px;
                        font-size: 36px;
                        font-weight: 600;
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