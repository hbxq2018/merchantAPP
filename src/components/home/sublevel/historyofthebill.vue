<template>
  <div class="billCheck">
        <mt-header fixed title="历史账单"><router-link to="/historyse" slot="left">
        <mt-button icon="back"></mt-button></router-link></mt-header>
        <div class="top_distance" v-for="(item,index) in data" :key="index">
          <div class="check_top">
            <div class="check_top_time"><span>{{item.time}}</span>年</div>
          </div>
          <div class="check_center" v-for="(item,index) in item.data1" :key="index" @click="particularsDetails(item)">
            <div class="checkCtSublevel">
              <div class="roder_left">
                  <b>{{item.time}}<span>月账单</span></b>
                  <p>&yen;{{item.money}}</p>
              </div>
              <div class="roder-right">
                  <span>{{item.state}}</span>
                  <img src="../../../../static/images/home_arrow.png" alt="账单详情图标">
              </div>
            </div>
          </div>
        </div>
  </div>
</template>

<script>
import {formatDate} from '../../../../untils/util';
import { InfiniteScroll } from 'mint-ui';
import store from '@/vuex/store'
import {mapState,mapMutations,mapGetters} from 'vuex'
export default {
  name: "billCheck",
  data() {
    return {
      time:'',
      data: [
        {
          time: "2018",
          data1: [
            {
              year:'2018',
              time: "4",
              money: "224.50",
              state: "详情"
            },
            {
              year:'2018',
              time: "5",
              money: "224.50",
              state: "详情"
            },
            {
              year:'2018',
              time: "6",
              money: "224.50",
              state: "详情"
            },
            {
              year:'2018',
              time: "7",
              money: "224.50",
              state: "详情"
            }
          ]
        },
        {
          time: "2019",
          data1: [
            {
              time: "4",
              money: "224.50",
              state: "详情"
            },
            {
              time: "5",
              money: "224.50",
              state: "详情"
            },
            {
              time: "6",
              money: "224.50",
              state: "详情"
            },
            {
              time: "7",
              money: "224.50",
              state: "详情"
            }
          ]
        },
        {
          time: "2020",
          data1: [
            {
              time: "4",
              money: "224.50",
              state: "详情"
            },
            {
              time: "5",
              money: "224.50",
              state: "详情"
            },
            {
              time: "6",
              money: "224.50",
              state: "详情"
            },
            {
              time: "7",
              money: "224.50",
              state: "详情"
            }
          ]
        }
      ]
    };
  },
  filters: {
        formatDate() {
            var date = new Date();
            let mon = date.getFullYear();
            let _data = formatDate(date, 'yyyy-MM-dd hh:mm')
            return mon;
        },
    },
    store,
  computed:{
    ...mapState(['userInfo','shopId']),
  },
  methods: {
    particularsDetails: function(item) {
      console.log("this is item " , item)
      this.$router.push({name: 'DetailsSon',params:item});
    },
  },
  created:function(){
    var date = new Date();
    let _data = formatDate(date, 'yyyy/mm/dd')
    console.log('_data:',_data)
    let arr = this.userInfo.createTime.split(' ');
    
    let _begain = arr[0];
    let obj = {
      shopId:this.shopId,
      begainTime:_begain,
      endTime:_data
    }
    let parms='',value='';
    for(var key in obj) {
      value = key+'='+obj[key]+'&';
      parms+=value;
      value=''
    }
    this.$axios.get('/api/hx/listAmount?'+parms)
    .then((res) => {
       console.log(res)
    })
   
  }
};
</script>

<style lang="less">
.billCheck {
  width: 100%;
  height: 100%;
  background: #ebebeb;
  .top_distance:nth-child(2) {
    margin-top: 80px;
  }
  .check_top {
    width: 100%;
    height: 80px;
    background: #ebebeb;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 2px;
    .check_top_time {
      text-align: left;
      line-height: 80px;
      width: 90%;
      height: 80px;
      font-size: 30px;
      color: #808080;
    }
  }
  .check_center {
    width: 100%;
    height: 145px;
    background: #fff;
    display: flex;
    justify-content: flex-end;
    .checkCtSublevel {
      width: 95%;
      height: 145px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      letter-spacing: 2px;
      .roder_left {
        line-height: 50px;
        text-align: left;
        b {
          font-size: 30px;
        }
        p {
          font-size: 27px;
          color: #929292;
        }
      }
      .roder-right {
        font-size: 28px;
        padding-right: 39px;
        color: #B1B1B1;
        span {
          vertical-align: margin;
        }
        img {
          width: 12px;
          height: 22px;
          padding-left: 21px;
          vertical-align: margin;
        }
      }
    }
  }
}
</style>


