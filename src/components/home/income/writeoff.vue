<template>
  <div class="awriteoff">
        <mt-header :title="title" class="income_header">
            <router-link :to="{path:'/bill',query:{start:start,end:end,actday:actday}}" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
    </mt-header>
        <ul class="writ">
            <li class="off" v-for="(item,index) in data" :key="index">
                <span class="wtitle">{{item.title}}</span>
                <span class="woff">{{item.value}}</span>
            </li>
        </ul>
  </div>
</template>
<script>
export default {
  name:'Writeoff',
  data(){
      return{
          title:'订单记录',
          start: '',
          end: '',
          actday:'',
          data:[
              {
                  title:'10元代金券',
                  value:'核销成功'
              },
              {
                  title:'消费金额',
                  value:'¥123'
              },
              {
                  title:'用 户',
                  value:'用户1'
              },
              {
                  title:'券 码',
                  value:'1230977'
              },
              {
                  title:'核销时间',
                  value:'2018-04-18 13:05:12'
              },
              {
                  title:'服务费',
                  value:'¥1'
              },
              {
                  title:'核销员',
                  value:''
              }
          ],
          skuName: '',
          servicePrice: 0
      }
  },
  methods:{
      getdata:function(id,type){
          let url='';
          if(type == 1){
            url="/api/app/so/get/";
            this.title='订单记录';
          }else if(type ==2){
            url="/api/app/hx/get/";
            this.title='核销记录';
          }
      this.$axios.get(url+id)
        .then((res) => {
            if(res.data.code ==  '0'){
               let _data = res.data.data;
               this.data[0].title = this.skuName;
               this.data[1].value = '¥ '+_data.shopAmount;
               this.data[2].value = _data.userName;
               this.data[3].value = _data.couponCode;
               let _date = new Date(_data.updateTime);
               let _y = _date.getFullYear();
               let _m = _date.getMonth()+1;
               let _d = _date.getDate();
               let _h = _date.getHours();
               let _mm = _date.getMinutes();
               let _s = _date.getSeconds();
               let newdate =_y+'-'+_m+'-'+_d+'  '+_h+':'+_mm+':'+_s;
               this.data[4].value = newdate;
               this.data[5].value = '¥ '+this.servicePrice;
               this.data[6].value = _data.cashierName;
            }
        })

      }
  },
  created:function(){
    //   app/so/getForOrder/
    console.log(this.$route.params);
    if(this.$route.params.id){
      let id = this.$route.params.id,type= this.$route.params.type;
      this.start= this.$route.params.start;
      this.end= this.$route.params.end;
      this.actday= this.$route.params.actday;
      this.skuName = this.$route.params.skuName;
      this.servicePrice = this.$route.params.servicePrice;
      this.getdata(id,type);
    }
  }
}
// toLocaleString()
</script>

<style lang="less">
    .awriteoff{
        width:100%;
        height:100%;
        position:fixed;
        left:0;
        top:0;
        overflow:auto;
        background:rgba(235,235,235,1);
        .writ{
            width: 100%;
            min-height: 200px;
            .off{
                background: #fff;
                font-style: normal;
                width: 100%;
                height: 89px;
                line-height: 89px;
                color: #B1B1B1;
                font-size: 24px;
                text-align: justify;
                .wtitle{
                    float: left;
                    margin-left: 40px;
                }
                .woff{
                    float: right;
                    margin-right: 40px;
                }
            }
            li:nth-child(1){
                .wtitle{
                    color: #191919;
                    font-size: 30px;
                }
            }
            li:nth-child(2){
                .woff{
                    color: #191919;
                    font-size: 30px;
                }
            }
            li:nth-child(7){
               margin-top: 30px;
            }
        }
    }
</style>


