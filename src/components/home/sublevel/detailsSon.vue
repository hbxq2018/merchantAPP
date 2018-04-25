<template>
  <div class="detailsSon">
      <mt-header :title="name">
        <router-link to="/historyofthebill" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
      </mt-header>
      <div class="detailsSon_top">
          <p>{{data.times}}</p>
          <span>本月服务费：<em>&yen;{{data.money}}</em></span>
          <img src="../../../../static/images/murcielagoimg.png" alt="">
      </div>
      <div class="murcielago">
          <p>本月已核销<span>342432</span>张代金券，总额度<span>244.50</span>元</p>
      </div>
      <div class="order_history" v-for="(item,index) in writedata" :key="index">
        <div class="order_h_sublevel">
            <div class="roder_left">
                <b>{{item.mianzhi}}<span>元代金券</span></b>
                <p>{{item.time}}<span>{{item.time1}}</span></p>
            </div>
            <div class="roder-right">
                <span>&yen;{{item.renminbi}}</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Manage",
  data() {
    return {
      name: "2018年4月账单详情",
      data:{
          times:'本月已缴清',
          money:'244.50'
      },
      writedata: [
        {
          mianzhi:'10',
          time:'2018-4-22',
          time1:'13:14:02',
          renminbi:'1.00'
        },
        {
          mianzhi:'10',
          time:'2018-4-22',
          time1:'13:14:02',
          renminbi:'1.00'
        },
        {
          mianzhi:'10',
          time:'2018-4-22',
          time1:'13:14:02',
          renminbi:'1.00'
        },
      ]
    };
  },
}
</script>

<style lang="less">
    .detailsSon{
        width: 100%;
        height: 100%;
        background: #EBEBEB;
        .detailsSon_top{
            width: 100%;
            height: 224px;
            background: #fff;
            letter-spacing: 2px;
            line-height: 60px;
            position: relative;
            p{
                font-size: 40px;
                color: #FC5E2D;
                padding-top: 60px;
            }
            span{font-size: 30px;}
            img{
                width: 183px;
                height: 183px;
                position: absolute;
                top: 20px;
                right: -10px;
            }
        }
        .murcielago{
            width: 100%;
            background: #EBEBEB;
            height: 96px;
            font-size: 26px;
            color: #808080;
            line-height: 96px;
            letter-spacing: 2px;
        }
        .order_history{
            background: #fff;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .order_h_sublevel{
                width: 94%;
                height: 145px;
                border-bottom: 1px solid #E0E0E0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                letter-spacing: 2px;
                .roder_left{
                    line-height: 50px;
                    text-align: left;
                    b{
                        font-size: 30px;
                    }
                    p{
                        font-size: 27px;
                        color: #929292;
                    }
                }
                .roder-right{
                    font-size: 30px;
                    padding-right: 39px;
                }
            }
        }
    }
</style>


