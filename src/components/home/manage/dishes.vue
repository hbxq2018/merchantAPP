<template>
  <div class="dishes">
    <mt-header :title="name">
        <router-link to="/manage" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
    </mt-header>
    <div class="dishesBox" :style="{'-webkit-overflow-scrolling': scrollMode}">
		<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="loadmore">
			<ul id="dishesUl" class="dishesUl">
				<li class="dishes_list clearfix" v-for="(item,index) in list" :key="index" :id="item.id" @click="toAddDishes">
					<img class="icon fl" :src="item.picUrl" alt="">
					<div class="text fl">
						<p>{{item.skuName}}</p>
						<p>{{item.skuInfo}}</p>
					</div>
					<div class="arrow fr"></div>
				</li>
			</ul>
		</mt-loadmore>
    </div>
    <div class="dishesBottom" @click="toAddDishes">
        <span>+</span>
        <span>添加推荐菜</span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Picker, Toast, Loadmore } from "mint-ui";
Vue.component(Loadmore.name, Loadmore);
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "dishes",
  data() {
    return {
      name: "推荐菜管理",
      list: [],
      page: 1,
      allLoaded: false,
      scrollMode: "auto"
    };
  },
  store,
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo"]),
    getDishList(type) {
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
            setTimeout(function() {
              var dishesUl = document.getElementById("dishesUl");
              var height = dishesUl.getElementsByClassName("dishes_list")[0]
                .offsetHeight;
              dishesUl.style.height =
                Math.ceil(height / 210 * 230 + 2) * _this.list.length + "px";
            }, 2000);
            if (lists.length < 8) {
              _this.allLoaded = true;
            }
          } else {
            _this.allLoaded = true;
            Toast("暂无数据");
          }
          if (type == "top") {
            _this.$refs.loadmore.onTopLoaded();
          } else if (type == "bot") {
            _this.$refs.loadmore.onBottomLoaded();
          }
          console.log(_this.allLoaded);
        } else {
          _this.allLoaded = true;
        }
      });
    },
    toAddDishes() {
      this.$router.push({ path: "/addDishes", params: {} });
    },
    loadTop() {
      //下拉加载
      this.page = 1;
      this.allLoaded = false;
      this.getDishList("top");
    },
    loadBottom() {
      // 上拉加载
      console.log("上拉");
      ++this.page;
      this.getDishList("bot");
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
  .mint-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }
  .dishesBox {
    min-height: 1300px;
    width: 100%;
    background-color: #ebebeb;
    padding: 81px 0 110px 0;
    box-sizing: border-box;
    overflow: scroll;
    .dishesUl {
      width: 100%;
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