<template>
  <div class="other" @click="allFlag">
      <mt-header fixed :title="name">
        <mt-button slot="left" icon="back" @click="clickback"></mt-button>
        <!-- <mt-button slot="right"  @click="save">保存</mt-button> -->
      </mt-header>
      <div class="ocontent">
          <div class="otherInfo clearfix" @click="isWeek">
              <div class="otherInfo_l">营业日</div>
              <div class="otherInfo_r">
              <span class="otherInfo_text fl">{{startWeek}}至{{endWeek}}</span>
              <span class="otherInfo_arrow fr"></span>
              </div>
          </div>
          <div class="otherInfo clearfix">
              <div class="otherInfo_l">营业时段</div>
              <div class="otherInfo_r">
                <div class="timeTxt fl" @click="isTime(1)">{{startTime}}</div>
                <div class="timeLine fl">~</div>
                <div class="timeLine fl fli">
                  <i :class='isNextDay?"":"acti"' @click="NextDay">今日</i>
                  <i :class='isNextDay?"acti":""' @click="NextDay">次日</i>
                </div>
                <div class="timeTxt fl" @click="isTime(2)">{{endTime}}</div>
              </div>
          </div>
          <div class="otherInfo clearfix">
              <div class="otherInfo_l">其他服务</div>
              <div class="otherInfo_r">
              <div v-for="(item,index) in otherArr" :key='index' class="other_item" :class="item.flag?'active':''" @click="setting(index)">{{item.name}}</div>
              </div>
          </div>
      </div>
      <div class="weekBox" v-if="weekFlag">
          <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
      </div>
      <mt-datetime-picker
          ref="picker"
          type="time"
          @confirm="handleConfirm">
      </mt-datetime-picker>
  </div>
</template>
<script>
import Vue from "vue";
import { Toast, Picker, DatetimePicker } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
Vue.component(Picker.name, Picker, DatetimePicker.name, DatetimePicker);
export default {
  name: "Other",
  data() {
    return {
      name: '其他信息',
      isNextDay:false,
      slots: [
        {
          flex: 1,
          values: [
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
            "星期日"
          ],
          className: "slot1",
          textAlign: "right"
        },
        {
          divider: true,
          content: "~",
          className: "slot2"
        },
        {
          flex: 1,
          values: [
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
            "星期日"
          ],
          className: "slot3",
          textAlign: "left"
        }
      ],
      otherArr: [
        {
          name: "Wifi",
          flag: false
        },
        {
          name: "停车位",
          flag: false
        },
        {
          name: "包间",
          flag: false
        }
      ],
      selectTime: 1,
      weekFlag: false,
      startWeek: "",
      endWeek: "",
      startTime: "",
      endTime: ""
    };
  },
  store,
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo"]),
    //点击返回
    clickback() {
      let startArr = [], endArr = [],_start = '',_end='',_endTime='';
      _endTime = this.endTime;
      startArr = this.startTime.split(':');
      endArr = this.endTime.split(':');
      _start = parseInt(startArr[0]) * 60 + parseInt(startArr[1]);
      _end = parseInt(endArr[0]) * 60 + parseInt(endArr[1]);
      if(this.isNextDay){
        _end += 60*24;
        _endTime = '次日'+_endTime;
      }
      if(_start >= _end){
        Toast('开始时间不得晚于结束时间');
        return false;
      }
      let otherService = '', shopHours = '';
      for(let i = 0; i < this.otherArr.length; i++) {
        if(this.otherArr[i].flag) {
          otherService += this.otherArr[i].name + ',';
        }
      }

      
      otherService = otherService + "/otherService";
      shopHours = this.startWeek + '至' + this.endWeek + ',' + this.startTime + '至' + _endTime + "/shopHours";
      this.setuserInfo(otherService);
      this.setuserInfo(shopHours);
      this.$router.push({ name: "Manage", params: {} });
    },
    allFlag() {
      this.weekFlag = false;
    },
    //营业时段的弹窗是否显示
    isTime(id) {
      this.selectTime = id;
      this.$refs.picker.open();
    },
    //是否选中次日
    NextDay(){
      this.isNextDay = !this.isNextDay;
    },
    //营业日的弹窗是否显示
    isWeek(e) {
      e.stopPropagation();
      this.weekFlag = !this.weekFlag;
    },
    //设置其他服务
    setting(idx) {
      this.otherArr[idx].flag = !this.otherArr[idx].flag;
    },
    //获取营业日的值
    onValuesChange(picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0]);
      }
      this.startWeek = values[0];
      this.endWeek = values[1];
    },
    //获取营业时段的值
    handleConfirm(time) {
      if (this.selectTime == 1) {
        this.startTime = time;
      } else if (this.selectTime == 2) {
        this.endTime = time;
      }
    }
  },
  watch: {},
  mounted() {
      let otherService = this.userInfo.otherService.split(',');
      let shopHours = this.userInfo.shopHours.split(',');
      for(let i = 0; i < otherService.length; i++) {
          for(let k = 0; k < this.otherArr.length; k++) {
            if(otherService[i] == this.otherArr[k].name) {
                this.otherArr[k].flag = true;
            }
          }
      }
      this.startWeek = shopHours[0].substring(0, shopHours[0].indexOf('至'));
      this.endWeek = shopHours[0].substring(shopHours[0].indexOf('至')+1, shopHours[0].length);
      this.startTime = shopHours[1].substring(0, shopHours[1].indexOf('至'));
      this.endTime = shopHours[1].substring(shopHours[1].indexOf('至')+1, shopHours[1].length);

      if(this.endTime.indexOf('次日') !=-1){
        this.isNextDay = true;
        this.endTime=this.endTime.replace("次日","");
      }
  },
  created: function() {
      
  }
};
</script>
<style lang="less">
.other {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #EBEBEB;
  overflow: scroll;
  .ocontent{
    padding-top: 80px;
  }
  .otherInfo {
    background-color: #fff;
    width: 100%;
    height: 100px;
    line-height: 100px;
    font-size: 30px;
    color: #000;
    padding: 0 15px 0 28px;
    box-sizing: border-box;
    border-bottom: 1px solid #e0e0e0;
    .otherInfo_l {
      float: left;
      height: 100%;
      width: 23%;
      text-align: left;
    }
    .otherInfo_r {
      float: right;
      height: 100%;
      width: 77%;
      color: #b1b1b1;
      text-align: center;
      .otherInfo_text {
        height: 100%;
        // width: 100%;
        padding-left: 90px;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 30px;
        color: #b1b1b1;
      }
      .timeTxt {
        width: 40%;
        height: 100%;
        line-height: 100px;
        font-size: 30px;
        color: #b1b1b1;
      }
      .timeLine {
          height: 100px;
          line-height: 100px;
          width: 5%;
          padding-top: -50px;
      }
      .fli {
          height: 100px;
          line-height: 100px;
          width: 15%;
          padding-top: -50px;
          font-size: 18px;
          position: relative;
          i{position: relative;}
          i:nth-child(1){
            top: -20px;
            left: 30px;
          }
          i:nth-child(2){
            top: 20px;
            left: -10px;
          }
          .acti{
            color: #fc5e2d;
          }
      }
      .otherInfo_arrow {
        width: 40px;
        height: 40px;
        position: relative;
        margin-top: 35px;
        &:after,
        &:before {
          content: "";
          position: absolute;
          top: 0;
        }
        &:after {
          left: 0px;
          border-left: 15px solid #fff;
          border-right: 15px solid transparent;
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
        }
        &:before {
          left: 2px;
          border-left: 15px solid #b1b1b1;
          border-right: 15px solid transparent;
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
        }
      }
      .other_item {
        display: inline-block;
        height: 50px !important;
        line-height: 50px;
        color: #b1b1b1;
        padding: 0 15px;
        margin-right: 16px;
        border-radius: 6px;
        border: 1px solid #b1b1b1;
        &.active {
          border: 1px solid #fc5e2d;
          color: #fc5e2d;
        }
      }
    }
  }
  .weekBox {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
  }
}
</style>