<template>
    <div class="fresh">
        <mt-header fixed title="享七生鲜">
            <router-link to="/promotion" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="freshTop">
            <div :class="isAll?'topLeft actTop':'topLeft'" @click="handTab(1)">全部</div>
            <div :class="!isAll?'topRight actTop':'topRight'" @click="handTab(2)">参与中</div>
        </div>
        <div class="freshcont">
            <ul class="freshUl" v-for="(item,index) in list" :key="index">
                <li class="freshLi" @click="handLi(item.id)">
                    <img class="liImg" :src="item.url" alt="图片">
                    <div class="libot">
                        <div class="lbl">
                            <p>{{item.p1}}</p>
                            <p>{{item.p2}}</p>
                        </div>
                        <div class="lbr">
                            <div :class="isSign?'lbrbb':'lbrb'">{{isSign?'参与中':'进行中'}}</div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import Vue from "vue";
import { Button } from 'mint-ui';
Vue.component(Button.name, Button);
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
export default {
  name: "fresh",
  data() {
    return {
      isAll: false,
      isSign:true, //是否参与活动   
      url: require('../../../../static/images/logo.png'),
      list:[
        {
          url:require('../../../../static/images/logo.png'),
          p1:"9.8元品阳澄湖大闸蟹",
          p2:"平台补贴，引流到店",
          id:1
        }
      ]
    };
  },
    store,
  computed: {
    ...mapState(["userInfo", "shopId", "shopInfo"])
  },
  methods:{
      //切换顶部tab
      handTab(val){
        this.isAll = val ==1?true:false;
      },
      //查询当前商家是否参与活动
      getInquire(){
        let _value = "skuType=1&shopId="+this.userInfo.id;
        this.$axios.get("/api/app/sku/isAdd?" + _value).then(res => {
            if (res.data.code == 0) {
              this.isSign = res.data.data==0?false:true;
            }
        });
      },
      //点击某个item
      handLi(id){
          console.log('id:',id)
          this.$router.push({ name: "FreshDetails", params: {id:id,isSign:this.isSign} });
      }
  },
  created:function(){
      this.getInquire();
  }
};
</script>
<style lang="less">
.fresh {
  width: 100%;
  height: 100%;
  background: #ebebeb;
  overflow: scroll;
  .freshTop {
    width: 100%;
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: #b1b1b1;
    background: #fff;
    position: fixed;
    top: 80px;
    left: 0;
    z-index: 11;
    .topLeft,
    .topRight {
      width: 40%;
      margin-left: 5%;
      margin-right: 5%;
      float: left;
    }
    .actTop {
      color: #fc5e2d;
      border-bottom: 1px solid #fc5e2d;
    }
  }
  .freshcont{
      width: 674px;
      padding: 0 38px;
      padding-top: 160px;
      .freshUl{
          width: 100%;
          height: auto;
          .freshLi{
              width: 100%;
              height: 486px;
              background: #fff;
              margin-top: 20px;
              .liImg{
                  width: 100%;
                  height: 376px;
              }
              .libot{
                  width: 100%;
                  height: 110px;
                  .lbl, .lbt{
                    height: 100%;
                    float: left;
                  }
                  .lbl{
                      width: 60%;
                      padding-top: 10px;
                      p{
                          width: 90%;
                          height: 45px;
                          line-height: 45px;
                          text-align: left;
                          padding-left: 21px;
                      }
                      p:nth-child(1){
                          color: #191919;
                          font-size: 30px;
                      }
                      p:nth-child(2){
                          color: #B1B1B1;
                          font-size: 24px;
                      }
                  }
                  .lbr{
                      width: 40%;
                      height: 110px;
                      float: right;
                      line-height: 110px;
                      div{
                        width:124px;
                        height:48px;
                        line-height: 50px;
                        margin-top: 25px;
                        margin-left:100px;
                        border-radius:24px;
                        color: #fff;
                      }
                      .lbrb{
                          background:rgba(252,94,45,1);
                      }
                      .lbrbb{
                           background:rgba(23,220,134,1);
                      }
                  }
              }
          }
      }
  }
}
</style>


