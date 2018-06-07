<template>
  <div class="mine">
      <div class="mine_top">
          <img class="u_img" :src="userInfo.logoUrl" alt="用户头像">
          <p class="u_name">{{userInfo.shopName}}</p>
      </div>
       <div class="list_ontrol" v-for="(item,index) in dataOne" :id="index" :key='index' @click="WeIntroduce">
          <div class="list_left">
              <img :src="item.src" :alt="item.name">
              <span>{{item.name}}</span>
          </div>
          <div class="list_right">
              <span v-if="item.tell">{{item.tell}}</span>
              <img :src="item.arrowDiagrams" alt="箭头">
          </div>
      </div>
      <button type="submit" @click="close">退出登录</button>
  </div>
</template>

<script>
import GLOBAL from '../../../untils/config/config';
import { MessageBox } from 'mint-ui';
import store from '@/vuex/store'
import {mapState,mapMutations,mapGetters} from 'vuex'
export default {
  name:'Mine',
  data(){
      return{
          API:GLOBAL.GLOBAL_API_DOMAIN,
          msg:'mine',
          data:{
            //   iconUrl: "../../../static/images/aboutMe.png",
              iconUrl: require("../../../static/images/aboutMe.png"),
              nickName:'noname',
          },
          dataOne:[
            {
                src: require("../../../static/images/juan-piao.png"),
                name:'缴费服务',
                arrowDiagrams:require("../../../static/images/home_arrow.png"),
            },{
                src: require("../../../static/images/shiyongsc.png"),
                name:'开店助手',
                arrowDiagrams:require("../../../static/images/home_arrow.png")
            },{
                src: require("../../../static/images/customer_service.png"),
                name:'联系客服',
                arrowDiagrams:require("../../../static/images/home_arrow.png"),
                tell:'027-59728176'
            },{
                src: require("../../../static/images/guanyu-wm.png"),
                name:'关于我们',
                arrowDiagrams:require("../../../static/images/home_arrow.png"),
            },{
                src: require("../../../static/images/yueseaef.png"),
                name:'店铺/收款码',
                arrowDiagrams:require("../../../static/images/home_arrow.png"),
            },
          ]
      }
  },
  store,
  computed:{
     ...mapState(['userInfo','shopId','newUserInfo','shopInfo']),
  },
  methods:{
      ...mapMutations(['setuserInfo','setshopId','setNewUserInfo','setshopInfo']),
      close:function(){
        MessageBox.confirm('确定要退出登录吗?').then(action => {
        if(action == 'confirm'){
            let obj={},id='';
            localStorage.setItem("userId",'');
            this.setuserInfo(obj)
            this.setshopId(id)
            this.setNewUserInfo(obj)
            this.setshopInfo(obj)
            this.$router.push('/')
        }
      },()=>{});
      },
      WeIntroduce:function(e){
          const listBoxID = e.currentTarget.id
          if(listBoxID ==3 ){
              this.$router.push('/aboutUs')
          }else if(listBoxID ==0){
              this.$router.push('/historyse')
          }else if(listBoxID ==2){
              window.location.href="tel:027-59728120"
          }else if(listBoxID ==1){
              this.$router.push('/serviceManual')
          }else if(listBoxID ==4){
              this.$router.push('/ihatetheqrcode')
          }
      }
  },
}
</script>
<style lang="less">
    .mine{
        width: 100%;
        height: 100%;
        background: #EBEBEB;
        .mine_top{
            width: 100%;
            height: 288px;
            background: #FC5E2D;
            .u_img{
                width: 114px;
                height: 114px;
                border-radius: 50%;
                background: #C7C5C5;
                position: relative;
                margin-top: 57px;
                font-size: 36px;
            }
            .u_name{
                color: #fff;
                font-size: 36px;
                margin-top: 17px;
            }
        }
        .list_ontrol{
            width: 100%;
            height: 100px;
            
            background: #fff;
            display: flex;
            flex-direction: row;
            .list_left{
                width: 50%;
                height: 100px;
                line-height: 100px;
                font-size: 30px;
                text-align: left;
                img{
                    width: 38px;
                    height: 38px;
                    padding: 0px 20px 0px 35px;
                    vertical-align: middle;
                }
                span{
                    vertical-align: middle;
                }
            }
            .list_right{
                width: 50%;
                height: 100px;
                line-height: 100px;
                text-align: right;
                img{
                    width: 12px;
                    height: 22px;
                    padding-right: 35px;
                }
                span{
                    padding-right: 24px;
                    font-size: 30px;
                }
            }
        }
        .list_ontrol:nth-child(2){margin: 20px 0px;}
        .list_ontrol:nth-child(3){border-bottom: 1px solid #E0E0E0;}
        .list_ontrol:nth-last-child(2){margin: 20px 0px;}
        button{
            width: 100%;
            height: 88px;
            background: #fff;
            border: none;
            margin-top: 20px;
        }
    }
</style>


