<template>
    <div class="dishlist">
        <mt-header fixed title="招聘菜列表">
            <router-link to="/actsign" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <ul class="dishul">
            <li class="dishli" v-for="(item,index) in list" :key="index" @click="clickdish(index,item.skuName,item.id,item.isSign)">
                <img :src="item.picUrl" alt="菜品图片">
                <div class="dishjs">
                    <p>{{item.skuName}}</p>
                    <p>{{item.skuInfo}}</p>
                </div>
                <span class="issign" v-if="item.isSign">已报名</span>
                <div v-else :class="index == ind?'dishsel actdishsel':'dishsel'">
                    <span></span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import Vue from "vue";
import { Radio } from "mint-ui";
Vue.component(Radio.name, Radio);
import store from "@/vuex/store";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "dishlist",
  data() {
    return {
      ind: -1,
      value: "",
      options: [],
      list:[],
      page:1
    };
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo", "setshopId", "setshopInfo"]),
    getDishList() {
        console.log('getDishList')
      let _this = this, _param = "";
      _param = "shopId=" + this.userInfo.id +"&actId=37"+ "&page=" + this.page + "&rows=8";
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
          }
        }
      });
    },
    clickdish: function(val, name, id,isSign) {
      if(!isSign){
        this.ind = val;
      this.$router.push({ name: "Actsign", params: { name: name, id: id } });
      }
      
    }
  },
    created:function(){
        this.getDishList();
    }
};
</script>
<style lang="less">
.dishlist {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  overflow: auto;
  background: #ebebeb;
  .dishul {
    width: 100%;
    padding-top: 85px;
    .dishli {
      margin: 10px 0;
      width: 100%;
      height: 130px;
      padding: 20px 0;
      list-style: none;
      width: 690px;
      margin-left: 30px;
      background: #fff;
      img {
        width: 130px;
        height: 130px;
        float: left;
        margin-left: 10px;
        border-radius: 10px;
      }
      .issign{
        position: relative;
        top: 50px;
      }
      .dishjs {
        margin-left: 20px;
        float: left;
        height: 130px;
        width: 400px;
        text-align: left;
        & > p:nth-child(1) {
          height: 30px;
          color: #191919;
          font-size: 36px;
        }
        & > p:nth-child(2) {
          margin-top: 20px;
          height: 90px;
          line-height: 40px;
          color: #b1b1b1;
          font-size: 22px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
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
  }
}
</style>




