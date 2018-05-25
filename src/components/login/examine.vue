<template>
  <div class="examine" :class="colorSit">
    <img class="examine_img" :src="examineImg" alt="">
    <p class="examine_state">{{msg}}</p>
    <p :hidden="status != 0">审核时间：预计2-3个工作日内</p>
    <div class="examine_btn" :class="colorBtn" :hidden="status == 0">
        <router-link :to="toHref">
            <mt-button type="default">{{btnTxt}}</mt-button>
        </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name:'Examine',
  data(){
      return {
        status: 0,
        msg: "入驻审核中",
        examineImg: "../../../static/images/wait.png",
        colorSit: "",
        colorBtn: "",
        toHref: "home",
        btnTxt: "进入店铺"
      }
  },
  created() {
      this.status = this.$route.params.status;
      console.log(this.status)
      if(this.status == 0) {
          this.msg = "入驻审核中";
          this.examineImg = "../../../static/images/wait.png";
          this.colorSit = "";
          this.toHref = "";
          this.colorBtn = "";
      } else if(this.status == 1) {
          this.msg = "恭喜你，审核通过";
          this.examineImg = "../../../static/images/pass.png";
          this.colorSit = "pass";
          this.colorBtn = "pass";
          this.toHref = "home";
          this.btnTxt = "进入店铺";
      } else if(this.status == 2) {
          this.msg = "审核没有通过";
          this.examineImg = "../../../static/images/noPass.png";
          this.colorSit = "nopass";
          this.colorBtn = "nopass";
          this.toHref = "settlein";
          this.btnTxt = "重新申请";
      }
  }
}
</script>
<style lang="less">
    .examine {
        padding-top: 312px;
        font-size: 30px;
        color: #FC5E2D;
        letter-spacing: 4px;
        .examine_img {
            width: 100px;
            height: 100px;
        }
        .examine_state {
            margin: 20px 0 14px 0;
        }
        .examine_btn {
            padding: 430px 131px 0 131px;
            button {
                width: 100%;
                border-radius: 50px;
                height: 80px;
                line-height: 80px;
                color: #FC5E2D;
                border: 1px solid #FC5E2D;
                background-color: #fff;
                font-size: 30px;
                letter-spacing: 4px;
            }
        }
        .examine_btn.pass {
            button {
                color: #13AD17;
                border: 1px solid #13AD17;
            }
        }
        .examine_btn.nopass {
            button {
                color: #FB3535;
                border: 1px solid #FB3535;
            }
        }
    }
    .examine.pass {
        color: #13AD17;
    }
    .examine.nopass {
        color: #FB3535;
    }
</style>


