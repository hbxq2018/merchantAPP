<template>
  <div class="mine">
      <div class="mine_top">
          <img class="u_img" :src="data.src" alt="用户头像">
          <p class="u_name">{{data.name}}</p>
      </div>
       <div class="list_ontrol" v-for="(item,index) in data1" :id="index" :key='index' @click="WeIntroduce">
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
import { MessageBox } from 'mint-ui';
export default {
  name:'Mine',
  data(){
      return{
          msg:'mine',
          data:{
              src: "../../../static/images/timg (2).jpg",
              name:'用户名称',
          },
          data1:[
            {
                src: "../../../static/images/juan-piao.png",
                name:'缴费服务',
                arrowDiagrams:"../../../static/images/home_arrow.png",
            },{
                src: "../../../static/images/customer_service.png",
                name:'联系客服',
                arrowDiagrams:"../../../static/images/home_arrow.png",
                tell:'027-59728176'
            },{
                src: "../../../static/images/guanyu-wm.png",
                name:'关于我们',
                arrowDiagrams:"../../../static/images/home_arrow.png",
            },
          ]
      }
  },
  methods:{
      close:function(){
        MessageBox({
        title: '提示',
        message: '确定要退出登录吗?',
        showCancelButton: true
        });
      },
      WeIntroduce:function(e){
          const listBoxID = e.currentTarget.id
          if(listBoxID ==2 ){
              this.$router.push('/aboutUs')
          }else if(listBoxID ==0){
              this.$router.push('/historyse')
          }
      }
  }
}
</script>
<style lang="less">
    body{
            background: #EBEBEB;
        }
    .mine{
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
        button{
            width: 100%;
            height: 88px;
            background: #fff;
            border: none;
            margin-top: 20px;
        }
    }
    .mint-msgbox{
        width: 532px;
        height: 305px;
        border-radius: 8px;
        .mint-msgbox-title{
            font-size: 36px;
        }
        .mint-msgbox-message{
            font-size: 30px;
        }
        .mint-msgbox-content{
            padding: 50px 0px;
        }
        .mint-msgbox-btn{
            height: 103px;
            font-size: 30px;
        }
        .mint-msgbox-confirm{
            background: #FC5E2D;
            color: #fff;
        }
    }
</style>


