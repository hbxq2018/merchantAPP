<template>
  <div class="shopMap">
    <mt-header title="详细地址">
      <mt-button slot="left" icon="back" @click="backtrack"></mt-button>
    </mt-header>
    <span @click="turnprovince">
      <mt-cell title="省/县/市" is-link>{{obj.Province}}-{{obj.City}}-{{obj.county}}</mt-cell>
    </span>
    <mt-cell title="详细地址"><input v-model="obj.address" class="address" type="text"></mt-cell>
    <div class="tishi">提示：为了方便顾客准确导航，请在地图标出店铺位置</div>
    <div class="map" id="container" style="width:100%; height:600px">
    </div>
    <div v-show="ispro" class="molde" @click="shutprovince">
       <mt-picker :slots="myAddressSlots" @change="onMyAddressChange"></mt-picker>
    </div>
  </div>
</template>
<script>
  import { Toast , Picker} from 'mint-ui'
  import AMap from 'AMap'
  var map
  import myaddress from '../../../static/address3.json' 
  import store from '@/vuex/store'
  import {mapState,mapMutations} from 'vuex'
  export default {
    data(){
      return {
        obj:{
          address:'',
          Province:'省',
          City:'市',
          county:'区/县',
          lng:'',//经度
          lat:''  //纬度
        },
        goback:'settlein',
        ispro:false,
        myAddressSlots: [
          {
            flex: 1,
            defaultIndex: 1,    
            values: Object.keys(myaddress),  //省份数组
            className: 'slot1',
            textAlign: 'center'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: [],
            className: 'slot3',
            textAlign: 'center'
          },
          {
            divider: true,
            content: '-',
            className: 'slot4'
          },
          {
            flex: 1,
            values: [],
            className: 'slot5',
            textAlign: 'center'
          }
        ]
      }
    },
    mounted: function () {
      this.init()
    },
    store,
    computed:{
      ...mapState(['userInfo']),
    },
    methods: {
      ...mapMutations(['setuserInfo']),
      init: function () {
        let _this = this;
        map = new AMap.Map('container', {
          center: [114.367237,30.571349],
          resizeEnable: true,
          zoom: 10
        })
         var marker = new AMap.Marker({
            position: map.getCenter(),
            draggable: true,
            cursor: 'move',
            raiseOnDrag: true
        });
        marker.setMap(map);

        map.plugin(['AMap.ToolBar', 'AMap.Scale','AMap.Marker'], function () {
          map.addControl(new AMap.ToolBar())
          map.addControl(new AMap.Scale())
        })

        map.plugin(['AMap.Geolocation'], function () {
          let geolocation = new AMap.Geolocation({
            timeout: 10000, //  超过10秒后停止定位，默认：无穷大
            // maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            zoomToAccuracy: true  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          })
          map.addControl(geolocation)
          geolocation.getCurrentPosition()
          AMap.event.addListener(geolocation, 'complete', (result) => {
            console.log(result.position.getLng())
            _this.obj.lng = result.position.getLng();//定位成功返回的经度
            _this.obj.lat = result.position.getLat();//定位成功返回的纬度
            let arr =[];
            arr.push(result.position.getLng())
            arr.push( result.position.getLat())
             if (marker) {
                marker.setMap(null);
                marker = null;
            }
            marker = new AMap.Marker({
              position:arr,
              draggable: true,
              cursor: 'move',
              raiseOnDrag: true
          });
          marker.setMap(map);
          })  //  返回定位信息
          AMap.event.addListener(geolocation, 'error', (result) => {
            console.log(result)
          })  //  返回定位出错信息
        })
        AMap.event.addListener(map, 'click', (result) => {
            _this.obj.lng = result.lnglat.lng;
            _this.obj.lat = result.lnglat.lat;
            let arr =[];
            arr.push(_this.obj.lng )
            arr.push(_this.obj.lat)
             if (marker) {
                marker.setMap(null);
                marker = null;
            }
            marker = new AMap.Marker({
              position:arr,
              draggable: true,
              cursor: 'move',
              raiseOnDrag: true
          });
          marker.setMap(map);
        });
      },
      onMyAddressChange(picker, values) {
       if(myaddress[values[0]]){  
          picker.setSlotValues(1,Object.keys(myaddress[values[0]])); // Object.keys()会返回一个数组，当前省的数组
          picker.setSlotValues(2,myaddress[values[0]][values[1]]); // 区/县数据就是一个数组
          this.obj.Province = values[0];
          this.obj.City = values[1];
          this.obj.county = values[2];
        }
      },
      turnprovince:function(){
        this.ispro = true;
      },
      shutprovince:function(){
        this.ispro = false;
      },
      backtrack:function(){
        let _obj = this.obj;
        if(!_obj.lng){
          Toast('请在地图上选择位置');
        }else if(!_obj.address){
          Toast('请在输入详细地址');
        }else if(!_obj.county){
          Toast('请选择所在省县市');
        }else{
          if(_obj.address){
            let _address = _obj.Province+_obj.City+_obj.county+_obj.address;
            let address = _address +'/'+'address'
            this.setuserInfo(address)
            // this.formdata[3].value = _address;
          }
          if(_obj.lat){
            let locationY = _obj.lat +'/'+'locationY'
            this.setuserInfo(locationY)
          }
          if(_obj.lng){
            let locationX = _obj.lng +'/'+'locationX'
            this.setuserInfo(locationX)
          }
          this.$router.push({path: this.goback,query:_obj})
        }
      }
    },
    created:function(){
      // console.log("this.$route.query:",this.$route.query)
      if(this.$route.query.ind == 1){
        this.goback = 'settlein'
      }else if(this.$route.query.ind == 2){
        this.goback = 'manage'
      }
    }
  }
</script>
<style lang="less">
  .shopMap{
    .map{
      width: 100%;
      height: 80%;
    }
    .mint-cell-value{
      color: #808080;
      font-size: 30px;
    }
    .address{
      width: 550px;
      border: none;
    }
    .tishi{
      width: 100%;
      height: 65px;
      line-height: 65px;
      color: #fff;
      background: #4897FE;
      text-align: center;
    }
    .molde{
      width:100%;
      height:100%;
      position:fixed;
      left:0;
      top:0;
      z-index: 99999;
      overflow:auto;
      background:rgba(0,0,0,0.44)!important;
      .picker{
        margin-top: 1175px;
        background: #fff;
      }
    }
  }
</style>
