<template>
  <div class="process">
        <img class="process_background" src="../../../static/images/background.png" alt="" />
        <div class="instruction">
            <p class="title">商家入驻流程</p>
            <div class="ins_process">
                <div>
                    <p class="num">1</p>
                    <p class="text">立即入驻</p>
                </div>
                <div>
                    <p class="num">2</p>
                    <p class="text">提交资质</p>
                </div>
                <div>
                    <p class="num">3</p>
                    <p class="text">审核资质</p>
                </div>
            </div>
            <div class="enterBox">
                <router-link to="settlein">
                    <span>立即入驻</span>
                </router-link>
            </div>
        </div>
  </div>
</template>
<script>
import GLOBAL from "../../../untils/config/config";
export default {
  name: "Process",
  data(){
      return {
        global: this.GLOBAL,
        msg:'process'
      }
  },
  created:function(){
      console.log("global:",this.global)
  }
}
</script>
<style lang="less">
    .process{
        position: relative;
        width:100%;
        height:100%;
        background-color:#fc5e2d; 
        color: #fff;
        .process_background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
        }
        .instruction {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 100;
            .title {
                font-size: 40px;
                margin: 99px 0;
            }
            .ins_process {
                display: flex;
                flex-direction: row;
                & > div {
                    flex: 1;
                    text-align: center;
                    .num {
                        font-size: 42px;
                        display: inline-block;
                        width: 80px;
                        height: 80px;
                        line-height: 80px;
                        border: 3px solid #fff;
                        border-radius: 50%;
                        margin-bottom: 22px;
                    }
                    .text {
                        font-size: 30px;
                    }
                }
            }
            .enterBox {
                padding: 0 131px;
                margin-top: 566px;
                height: 80px;
                span {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    line-height: 80px;
                    background-color: #fff;
                    color: #FC5E2D;
                    font-size: 30px;
                    border-radius: 50px;
                    box-shadow: 1px 5px 5px rgba(148, 37, 2, 0.7);
                    border: 0;
                }
            }
        }       
    }
</style>


