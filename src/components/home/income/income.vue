<template>
    <div class="income">
		<mt-header title="营业数据" class="income_header">
            <router-link to="/home" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
            <mt-button @click="turnmore(1)" slot="right" class="income_header_date">{{actday}}</mt-button>
		</mt-header>
    
   <mt-datetime-picker
    ref="picker"
    type="time"
    v-model="pickerValue">
  </mt-datetime-picker>

        <div class="mobox" @click="closemore" v-show="ismore">
            <div class="triangle" v-show="isselectday"></div>
            <ul class="moreday" v-show="isselectday">
                <li class="adays" v-for="(item,index) in days" :key='index' :id='item.title' @click="selectday">{{item.title}}</li>
            </ul>
            <div class="select" v-show="isselecttime">
                <div class="select_top">
                    <span class="stleft">选择时间</span>
                    <span :class="isday ? 'actsel stright' : 'stright' " @click="byday">按日</span>
                    <span :class="isday ? 'stright' : 'stright actsel' " @click="bymonth">按月</span>
                </div>
                <div class="date">
                    
                </div>
                <div class="selbut">
                    <div class="close" @click="close">取消</div>
                    <div class="cfrm" @click="cfrm">确定</div>
                </div>
            </div>
            
        </div>
        <div class="income_banner">
            <div class="income_banner_data">
                <p class="income_data_num">￥909</p>
                <p>营业额</p>
            </div>
            <div class="income_banner_data">
                <p class="income_data_num">9</p>
                <p>核销券数</p>
            </div>
        </div>
        <div class="income_operate">
            <div class="income_operate_result">
                <p>2018-04</p>
                <p>
                    <span>营业额：￥30215.50</span>
                    <span>核销券数：286张</span>
                </p>
            </div>
            <div class="income_operate_time" @click="turnmore(2)">
                <img src="../../../../static/images/calendar.png" alt="">
            </div>
        </div>
        <div class="income_list">
            <ul>
                <li class="income_li">
                    <div class="income_li_l">
                        <div class="face_value">
                            10元
                        </div>
                    </div>
                    <div class="income_li_r">
                        <div class="income_amount">
                            <p>消费金额</p>
                            <p>￥122</p>
                        </div>
                        <div class="income_date">2018-04-18 12:45:23</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Vue from "vue"
import { DatetimePicker } from 'mint-ui';
Vue.component(DatetimePicker.name, DatetimePicker);
export default {
  name: "Income",
  data() {
    return {
        pickerValue:'',
        Visible:true,
        ismore:false,
        actday:'',
        isday:true,
        isselectday:false,
        isselecttime:false,
        days:[
            {
                title:'今日'
            },{
                title:'7日'
            },{
                title:'15日'
            }
        ]
    }
  },
  created: function() {
    this.actday = this.days[0].title;
  },
  methods: {
      openPicker() {
        this.$refs.picker.open();
      },
      byday:function(){
          this.isday = true;
          console.log("byday")
      },    
      bymonth:function(){
          this.isday = false;
          console.log("bymonth")
      },
      close:function(){
          console.log("close")
      },  
      cfrm:function(){
          console.log("cfrm")
      },  
      turnmore:function(val){
          this.ismore = true;
          if(val == 1){
              this.isselectday = true;
          }else if(val ==2){
              console.log('ww22')
              this.isselecttime = true;
              this.pickerVisible = true;
          }
      },
      closemore:function(){
          this.ismore = false;
          this.isselectday = false;
          this.isselecttime = false;
      },
      selectday:function(e){
          this.actday = e.currentTarget.id;
      }
  }
};
</script>

<style lang="less">
.income {
  p {
    margin: 0;
  }
  width: 100%;
  height: 100%;
  font-family: "微软雅黑";
  position: relative;
  font-size: 30px;
  .iconimg{
    //   margin-top:10px;
      transform:rotate(90deg);
      border: 1px solid red;
  }
  .income_banner {
    margin-top: -1px;
    background-color: #fc5e2d;
    display: flex;
    height: 264px;
    color: #fff;
    .income_banner_data {
      flex: direction-flex;
      width: 50%;
      height: 100%;
      padding-top: 60px;
      box-sizing: border-box;
      p {
        font-size: 30px;
      }
      .income_data_num {
        margin-bottom: 20px;
        font-size: 54px;
      }
    }
  }
  .income_operate {
    height: 120px;
    padding: 20px 41px;
    box-sizing: border-box;
    background-color: #ebebeb;
    display: flex;
    & > div {
      flex: direction-flex;
      justify-content: space-between;
    }
    .income_operate_result {
      text-align: left;
      width: 90%;
      p:first-child {
        font-size: 32px;
        color: #1f1f1f;
      }
      p:last-child {
        font-size: 24px;
        color: #808080;
        span:first-child {
            margin-right: 39px;
        }
      }
    }
    .income_operate_time {
      text-align: right;
      width: 10%;
      img {
        margin-top: 15px;
        width: 47px;
        height: 47px;
      }
    }
  }
  .income_list {
    background-color: #fff;
    ul {
        padding: 0;
        margin: 0;
        li {
            display: flex;
            padding: 16px 40px;
            box-sizing: border-box;
            text-align: left;
            & > div {
                flex: direction-flex;
                justify-content: space-between;
            }
            .income_li_l {
                width: 18%;
                .face_value {
                    height: 90px;
                    width: 90px;
                    background-color: #FC5E2D;
                    border-radius: 50%;
                    color: #fff;
                    text-align: center;
                    line-height: 90px;
                    font-size: 32px;
                }
            }
            .income_li_r {
                width: 82%;
                .income_amount {
                    display: flex;
                    padding: 5px 0 12px 0;
                    box-sizing: border-box;
                    p {
                        flex: direction-flex;
                        justify-content: space-between;
                        font-size: 30px;
                        color:#1F1F1F;
                        font-weight: 600;
                    }
                    p:first-child {
                        width: 80%;

                    }
                    p:last-child {
                        width: 20%;
                        text-align: right;
                        color:#FC5E2D;
                    }
                }
                .income_date {
                    font-size: 26px;
                    color:#929292;
                }
            }
        }
    }
  }
  .mobox{
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    overflow: auto;
    height: 90%;
    margin-top: 10%;
    background: rgba(0, 0, 0, 0.44);
    font-size: 30px;
    .triangle
        {
            width:0px;
            height:0px;
            border-right:15px solid  rgba(0,0,0,0);
            border-bottom:15px solid #fff;
            border-left:15px solid  rgba(0,0,0,0);
            float: right;
            margin-right: 43px;
        }
    .moreday{
        width: 126px;
        height: 244px;
        background: #fff;
        float: right;
        margin-right: -70px;
        margin-top: 14px;
        
        .adays{
            width: 80%;
            margin-left: 10%;
            height: 77px;
            line-height: 77px;
            font-style: normal;
            border-bottom: 1px solid #b1b1b1;
        }
    }
  }
  .select{
      width: 672px;
      height: 550px;
      background: #fff;
      position: absolute;
      top: 50%;
      z-index: 5;
      left: 50%;
      margin-left: -336px;
      margin-top: -275px;
      .select_top{
          width: 90%;
          height: 100px;
          line-height: 100px;
          margin-left: 5%;
          .stleft{
              float: left;
          }
          .stright{
              float: right;
              margin: 0 10px;
          }
          .actsel{
              color: #FC5E2D;
          }
      }
      .date{
          width: 100%;
          height: 344px;
          border: 1px solid red;
      }
      .selbut{
          width: 100%;
          height: 103px;
          border-top: 1px solid #E0E0E0;
          div{
            float: left;
            height: 100%;
            line-height: 103px;
            text-align:center;
          }
          .close{
            width: 49.8%;
            border-right: 1px solid #E0E0E0;
          } 
          .cfrm{
              width: 50%;
          }

      }
  }
}
</style>