<template>
  <div class="Manual">
    <mt-header title="开店助手"><router-link slot="left" :to="{path:'home',query:{'ind':index}}">
    <mt-button icon="back"></mt-button></router-link></mt-header>
    <div class="manualTop">
        <img :src="data.src" alt="开店助手">
    </div>
    <div class="manualCer" v-for="(item,index) in database" :id="index" :key='index' @click="WeIntroduce">
        <div class="manualRig">
            <div class="manualLes">
                <span class="order">{{item.order}}</span>
                <span>{{item.synopsis}}</span>
            </div>
            <div class="list_right">
                <img :src="item.arrowDiagrams" alt="箭头">
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { MessageBox } from "mint-ui";
export default {
  name: "Manual",
  data() {
    return{
          index:2,
          msg:'Manual',
          data:{
              src: 'https://xq-1256079679.file.myqcloud.com/test_753818175736311351_0.8.jpg',
          },
          database:[
              {
                order:'01.关于享7美食',
                synopsis:'简介',
                arrowDiagrams:require("../../../../static/images/home_arrow.png")
              },{
                order:'02.如何入驻',
                synopsis:'如何注册、提交资质',
                arrowDiagrams:require("../../../../static/images/home_arrow.png"),
              },{
                order:'03.如何使用',
                synopsis:'如何核销/验券、查看数据',
                arrowDiagrams:require("../../../../static/images/home_arrow.png"),
              },{
                order:'04.如何提高客流量',
                synopsis:'设置享7券、设置套餐',
                arrowDiagrams:require("../../../../static/images/home_arrow.png"),
              },{
                order:'05.常见问题',
                synopsis:'收费情况、补贴政策',
                arrowDiagrams:require("../../../../static/images/home_arrow.png"),
              }
          ]
      }
  },
  methods:{
      WeIntroduce:function(e){
          const listBoxID = e.currentTarget.id
          if(listBoxID ==0 ){
              this.$router.push({ name: "Aboutthefood", params: {} });
          }else if(listBoxID ==1){
            this.$router.push({ name: "Howtocheckin", params: {} });
          }else if(listBoxID ==2){
            this.$router.push({ name: "Howtouse", params: {} });   
          }else if(listBoxID ==3){
            this.$router.push({ name: "ImproveService", params: {} });
          }else if(listBoxID ==4){  
            this.$router.push({ name: "Questions", params: {} });
          }
      }
  }
};
</script>


<style lang="less">
    .manualTop{
        width: 100%;
        height: 292px;
        img{
            width: 100%;
            height: auto;
        }
    }
    .manualCer{
        width: 100%;
        height: 144px;
        display: flex;
        justify-content: flex-end;
        .manualRig{
            width: 94%;
            height: 144px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 56px;
            border-bottom: 0.5px solid #E0E0E0;
            .order{
                display: block;
            }
            .manualLes{
                text-align: left;
            }
            .manualLes span:nth-child(1){
                color: #FC5E2D;
                font-size: 36px;
            }
            .manualLes span:nth-child(2){
                color: #B1B1B1;
                font-size: 28px;
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
    }
</style>


