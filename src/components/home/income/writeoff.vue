<template>
  <div class="awriteoff">
        <mt-header title="核销记录" class="income_header">
            <router-link to="/income" slot="left">
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
          ]
      }
  },
  methods:{

  },
  created:function(){
    //   app/so/getForOrder/
      if(this.$route.params.id){
        let id = this.$route.params.id;
      this.$axios.get("/app/hx/get/"+id)
        .then((res) => {
            if(res.data.code ==  '0'){
               let _data = res.data.data;
               this.data[0].title = _data.couponAmount+'元代金券';
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
               this.data[5].value = '¥ '+_data.couponAmount/10;
               this.data[6].value = _data.cashierName;
            }
        })
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


