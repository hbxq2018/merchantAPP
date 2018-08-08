 <!-- 提现 -->
<template>
    <div class="withdraw">
        <mt-header fixed :title="title">
            <mt-button slot="left" icon="back" @click="goback"></mt-button>
            <router-link slot="right" :to="{path:'withnodes'}" v-if="!iseditbank">
                <mt-button>提现记录</mt-button>
            </router-link>
        </mt-header>

        <div class="content" v-if="!iseditbank">
            <div class="start-one">
                <div class="ont-top" @click="handtop">
                    <div class="ont-top-left">
                        <p class="p-one" v-if="isbankno && bankName">{{bankName}}（尾号{{Lastfour}}）</p>
                        <p class="p-one" v-if="!isbankno">添加银行卡</p>
                        <p class="p-two">48小时内到账</p>
                    </div>
                    <div class="ont-top-right">
                        <img class="nextimg" :src="nextimg" alt="下一步">
                    </div>
                </div>
                <div class="ont-cont">
                    <p class="cont-p1">提现金额</p>
                    <p class="cont-p2">¥<span class="p2span">{{drawmoney | changemoney}}</span></p>
                    <p class="cont-p3">提现免手续费</p>
                    <mt-button :class="isbankno && cardnumber?'save_act':'save'" @click.native="handwithdraw" type="primary">提现</mt-button>
                </div>
            </div>
        </div>


        <div class="addTo" v-if="iseditbank">
            <mt-field label="持卡人" placeholder="请输入持卡人姓名" v-model="username"></mt-field>
            <mt-field label="卡号" placeholder="请输入银行卡号" type="number" v-model="cardnumber" value="cardnumber"></mt-field>
            <mt-button :class="isbankno && username && cardnumber?'save_act':'save'" @click.native="handleSave" type="primary">保存</mt-button>
        </div>

        <div class="modal" v-if="sheetVisible">
            <div class="modal-top"> 到账银行卡</div>
            <div class="modal-cont">
                <div class="modal-cont-left">
                    <p class="modal-one">建设银行（尾号{{Lastfour}})</p>
                    <p class="modal-two">48小时内到账</p>
                </div>
                <div class="modal-cont-right" @click="handchange">更改</div>
            </div>
        </div>

        

        <mt-actionsheet
            :actions="actions"
            cancelText=''
            v-model="sheetVisible">
        </mt-actionsheet>

    </div>
</template>

<script>
import Vue from "vue";
import { Button, Actionsheet, Toast } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
Vue.component(Actionsheet.name, Actionsheet);
 
import getBank from "../../../../static/bankCardAttribution.js" //校验银行卡
export default {
  nama: "withdraw",
  data() {
    return {
      title: "提现",
      bankName:'',
      Lastfour: "",
      drawmoney: 0, //可提现金额
      username: "", //持卡人
      cardnumber: "", //银行卡号
      nextimg: require("../../../../static/images/home_arrow.png"),
      actions: [],
      sheetVisible: false, //蒙层是否显示
      isbankno: true, //验证银行卡是否正确
      iseditbank: false //是否有银行卡
    };
  },
  store,
  computed: {
    ...mapState(["userInfo", "shopInfo"])
  },
  filters: {
    changemoney: function(val) {
      val = val * 1;
      val = val.toFixed(2);
      let result = addCommas(val),
        x = "",
        x1 = 0,
        x2 = 0;
      function addCommas(nStr) {
        nStr += "";
        x = nStr.split(".");
        x1 = x[0];
        x2 = x.length > 1 ? "." + x[1] : "";
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, "$1" + "," + "$2");
        }
        val = x1 + x2;
        return val;
      }
      return result;
    }
  },
  watch: {
    cardnumber: function(val) {
      let bankno = val,
        _this = this;
      bankno = bankno.replace(/\s/g, "");
      if (bankno) {
        if (bankno.length > 15 && bankno.length < 20) {
          let strBin =
            "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
          if (strBin.indexOf(bankno.substring(0, 2)) > -1) {
            this.luhnCheck(bankno);
          }
        } else {
          this.isbankno = false;
        }
      }
    }
  },
  methods: {
    //银行卡号Luhn校验算法
    //luhn校验规则：16位银行卡号（19位通用）:
    //1.将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2。
    //2.将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
    //3.将加法和加上校验位能被 10 整除。

    //bankno为银行卡号
    luhnCheck: function(bankno) {
      //校验银行卡是否正确
      var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）

      var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
      var newArr = new Array();
      for (var i = first15Num.length - 1; i > -1; i--) {
        //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1));
      }
      var arrJiShu = new Array(); //奇数位*2的积 <9
      var arrJiShu2 = new Array(); //奇数位*2的积 >9

      var arrOuShu = new Array(); //偶数位数组
      for (var j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 == 1) {
          //奇数位
          if (parseInt(newArr[j]) * 2 < 9)
            arrJiShu.push(parseInt(newArr[j]) * 2);
          else arrJiShu2.push(parseInt(newArr[j]) * 2);
        } else arrOuShu.push(newArr[j]); //偶数位
      }

      var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
      var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
      for (var h = 0; h < arrJiShu2.length; h++) {
        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
      }

      var sumJiShu = 0; //奇数位*2 < 9 的数组之和
      var sumOuShu = 0; //偶数位数组之和
      var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
      var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
      var sumTotal = 0;
      for (var m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
      }

      for (var n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
      }

      for (var p = 0; p < jishu_child1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
      }
      //计算总和
      sumTotal =
        parseInt(sumJiShu) +
        parseInt(sumOuShu) +
        parseInt(sumJiShuChild1) +
        parseInt(sumJiShuChild2);

      //计算luhn值
      var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
      var luhn = 10 - k;

      if (lastNum == luhn) {
        console.log("验证通过");
        this.isbankno = true;
        // return true;
      } else {
        console.log("银行卡号必须符合luhn校验");
        this.isbankno = false;
        // return false;
      }
    },
    //点击保存，保存持卡人和银行卡号信息
    handleSave: function() {
      if (!this.username) {
        Toast("请输入持卡人姓名");
      } else if (!this.cardnumber) {
        Toast("请输入银行卡号");
      } else if (!this.isbankno) {
        Toast("银行卡号输入错误，请重新输入");
      } else {
        let _parms = {
            userId: this.shopInfo.id,
            accountName: this.cardnumber,
            accountCardholder: this.username
          },
          _value = "";
        for (var key in _parms) {
          _value += key + "=" + _parms[key] + "&";
        }
        _value = _value.substring(0, _value.length - 1);
        this.$axios.post("api/app/account/update?" + _value).then(res => {
          if (res.data.code == 0) {
            Toast("保存成功");
            this.iseditbank = !this.iseditbank;
            this.getaccountInfo();
          }
        });
      }
    },
    //点击提现按钮，申请提现
    handwithdraw: function() {
      if (!this.cardnumber) {
        Toast("请先输入卡号再申请提现");
      } else if (this.drawmoney <= 0) {
        Toast("账户可提现余额不足，不可申请提现");
      } else if (this.isbankno && this.cardnumber && this.drawmoney > 0) {
        //如果有银行卡且银行卡号正确且可提现金额大于零,则继续提现流程
        this.$axios
          .get(this.$GLOBAL.API+"app/tx/selectByShopId?shopId=" + this.userInfo.id)
          .then(res => {
            //查询当前是否符合提现的其它条件
            if (res.data.code == 0) {
              this.tixian();
            } else {
              res.data.message = res.data.message.replace("该", "");
              Toast(res.data.message);
            }
          });
        return false;
      }
    },
    //提现
    tixian: function() {
      this.$axios
        .get(this.$GLOBAL.API+"app/tx/selectCashTime?shopId=" + this.userInfo.id)
        .then(res => {
          //查询开始时间
          if (res.data.code == 0) {
            let begtime = "",
              _endTime = "";
            if (res.data.data && res.data.data.endTime) {
              begtime = res.data.data.endTime;
            } else {
              begtime = 1514736000 * 1000; //首次提现以2018-01-01 0：00：00为开始时间
            }

            begtime = new Date(begtime);
            let _beginTime =
              begtime.getFullYear() +
              "-" +
              (begtime.getMonth() + 1) +
              "-" +
              begtime.getDate();

            var day1 = new Date();
            day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
            _endTime =
              day1.getFullYear() +
              "-" +
              (day1.getMonth() + 1) +
              "-" +
              day1.getDate();
            
            let _parms = {
                userId: this.shopInfo.id,
                userName: this.shopInfo.userName,
                cashAmount: this.drawmoney,
                beginTime: _beginTime,
                endTime: _endTime
              },
              _value = "";
            for (var key in _parms) {
              _value += key + "=" + _parms[key] + "&";
            }
            _value = _value.substring(0, _value.length - 1);
            this.$axios.post(this.$GLOBAL.API+"app/tx/create?" + _value).then(res => {
              if (res.data.code == 0) {
                Toast("申请提现成功");
              }
            });
          }
        });
    },
    handtop: function() {
      //点击编辑银行卡上部，
      if (this.isbankno && this.cardnumber) {
        //如果有银行卡且银行卡号正确,则打开修改银行卡
        this.sheetVisible = true;
      } else {
        //如果没有银行卡或银行卡号正确,添加银行卡
        this.title = "添加银行卡";
        this.iseditbank = true;
      }
    },
    //进行修改银行卡
    handchange: function() {
      this.title = "修改银行卡";
      this.sheetVisible = false;
      this.iseditbank = true;
    },
     //点击左上角返回图标
    goback: function() {
      if (this.iseditbank) {
        this.iseditbank = false;
        this.getaccountInfo();
        this.title = "提现";
      } else {
        this.$router.push("/wallet");
      }
    },
    //查询可提现金额
    getdrawAmount: function() {
      let _value = "soStatus=2&isDui=0&shopId=" + this.shopInfo.shopId;
      this.$axios.get("api/app/so/totalAmount?" + _value).then(res => {
        if (res.data.code == 0) {
          this.drawmoney = res.data.data;
        }
      });
    },
    //根据用户id查询账户信息
    getaccountInfo: function() {
      let _value = "userId=" + this.shopInfo.id;
      this.$axios.get("api/app/account/getByUserId?" + _value).then(res => {
        if (res.data.code == 0) {
          let _data = res.data.data;
          this.cardnumber = _data.accountName;
          this.username = _data.accountCardholder;
          this.checkBanks(_data.accountName);
          this.Lastfour = _data.accountName.substr(
            _data.accountName.length - 4,
            4
          );
        }
      });
    },
    // 查询银行卡信息
    checkBanks:function(val){
      let bankInfo = getBank.bankCardAttribution(val);
      this.bankName = bankInfo.bankName;
    }
  },
  created: function() {
    this.getdrawAmount();
    this.getaccountInfo();
  }
};
</script>


<style lang="less">
.withdraw {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #ebebeb;
  .content {
    margin-top: 100px;
    .start-one {
      width: 100%;
      height: 100%;
      & > div {
        width: 616px;
        height: 90px;
        padding: 20px 30px;
        margin-left: 37px;
        background: #fff;
      }
      .ont-top {
        .ont-top-left {
          width: 70%;
          height: 100%;
          float: left;
          overflow: hidden;
          & > p {
            height: 44px;
            line-height: 44px;
            text-align: left;
            overflow: hidden;
          }
          .p-one {
            color: #191919;
            font-size: 30px;
          }
          .p-two {
            color: #808080;
            font-size: 24px;
          }
        }
        .ont-top-right {
          float: right;
          .nextimg {
            width: 12px;
            height: 22px;
            margin-top: 30px;
          }
        }
      }
      .ont-cont {
        margin-top: 20px;
        height: 428px;
        & > p {
          width: 100%;
          text-align: left;
        }
        .cont-p1 {
          margin-top: 30px;
          margin-bottom: 56px;
          color: #191919;
          font-size: 30px;
        }
        .cont-p2 {
          font-size: 58px;
          .p2span {
            font-size: 100px;
          }
        }
        .cont-p3 {
          font-size: 24px;
          color: #808080;
          margin-top: 45px;
        }
      }
    }
  }
  .addTo {
    margin-top: 80px;
    .save_act {
      width: 694px;
      margin-top: 30px;
      background: #fc5e2d;
    }
    .save {
      width: 694px;
      margin-top: 30px;
      background: #ffc0ac;
    }
  }
  .modal {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 3010;
    width: 674px;
    height: 227px;
    background: #fff;
    padding: 0 38px;
    & > div {
      width: 100%;
      height: 113px;
      border-bottom: 1px solid #ebebeb;
    }
    .modal-top {
      line-height: 113px;
      color: #191919;
      font-size: 30px;
      text-align: left;
    }
    .modal-cont-left {
      width: 70%;
      float: left;
      .modal-one {
        color: #191919;
        font-size: 34px;
        text-align: left;
        height: 45px;
        line-height: 45px;
        margin-top: 16px;
      }
      .modal-two {
        color: #808080;
        font-size: 24px;
        text-align: left;
        height: 36px;
        line-height: 35px;
      }
    }
    .modal-cont-right {
      width: 25%;
      float: right;
      height: 100%;
      line-height: 113px;
      color: #5578ba;
      font-size: 34px;
    }
  }
  .save_act {
    width: 100%;
    margin-top: 30px;
    background: #fc5e2d;
  }

  .carr-cont {
    width: 674px;
    height: 245px;
    padding: 38px 56px;
    margin-top: 20px;
    background: #fff;
    & > div {
      width: 100%;
      height: 122.5px;
    }
    .carleft {
      width: 10%;
      height: 100%;
      float: left;
    }
    .carright {
      width: 90%;
      height: 100%;
      float: left;
      & > p {
        text-align: left;
      }
      p:nth-child(1) {
        color: #fc5e2d;
      }
      p:nth-child(2) {
        margin-top: 20px;
      }
    }
  }
  .save {
    width: 100%;
    margin-top: 30px;
    background: #ffc0ac;
  }
}
</style>




