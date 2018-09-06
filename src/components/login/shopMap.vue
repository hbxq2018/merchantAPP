<template>
  <div class="shopMap">
    <mt-header title="详细地址">
      <mt-button slot="left" icon="back" @click="backtrack"></mt-button>
    </mt-header>
    <div class="shopMap_cont">
      <span @click="turnprovince">
        <mt-cell title="省/县/市" is-link>{{obj.Province}}-{{obj.City}}-{{obj.county}}</mt-cell>
      </span>
      <mt-cell title="详细地址"><input v-model="obj.address" class="address" type="text"></mt-cell>
      <div class="tishi">提示：为了方便顾客准确导航，请在地图标出店铺位置</div>
  
      <div class="map" id="container" :style="styleObject">
      </div>
      <div v-show="ispro" class="molde" @click="shutprovince">
        <mt-picker :slots="myAddressSlots" @change="onMyAddressChange"></mt-picker>
      </div>
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
        styleObject: {
          width:'100%',
          height:'400px'
        },
        oDivWidth:'100%',
        oDivHeight:'400',
        goback:'settlein',
        isfirst:true,
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

        // 数据初始化
        this.obj.lng = this.userInfo.locationX;
        this.obj.lat = this.userInfo.locationY;
        let _address = this.userInfo.address;
        if(_address){
          if (_address.indexOf('-') > 0) {
            let _arr = _address.split('-');
            this.obj.Province=_arr[0];
            this.obj.City=_arr[1];
            this.obj.county=_arr[2];
            this.obj.address=_arr[3];
          }
        }
        console.log('obj:',_this.obj);
        
        // 地图初始化
        let maparr =[],_maplng='',_maplat='';
        _maplng = _this.obj.lng?_this.obj.lng:'110.786101';
        _maplat = _this.obj.lat?_this.obj.lat:'32.652465';

        maparr.push(_maplng);
        maparr.push(_maplat);
        map = new AMap.Map('container', {
          center: maparr,
          resizeEnable: true,
          zoom: 15
        });
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
            showCircle: false,     //定位成功后用圆圈表示定位精度范围，默认：true  （去掉圆形区域）
            zoomToAccuracy: true  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          map.addControl(geolocation);  //左下角定位图标
          if(!_this.obj.City){
            console.log('getCurrentPosition');
            geolocation.getCurrentPosition(); //自动定位当前位置
          }

          AMap.event.addListener(geolocation, 'complete', (result) => {
            // result.position.getLng();//定位成功返回的经度
            // result.position.getLat();//定位成功返回的纬度
            let arr =[],_lng='',_lat='';
            // _lng = _this.obj.lng?_this.obj.lng:result.position.getLng();
            // _lat = _this.obj.lat?_this.obj.lat:result.position.getLat();

            _lng = result.position.getLng()?result.position.getLng():_this.obj.lng;
            _lat = result.position.getLat()?result.position.getLat():_this.obj.lat;
            arr.push(_lng);
            arr.push(_lat);
            if (marker) {
              marker.setMap(null);
              marker = null;
            };
            map.setZoomAndCenter(14, arr);
            marker = new AMap.Marker({
              position:arr,
              draggable: true,
              cursor: 'move',
              raiseOnDrag: true
            });
            marker.setMap(map);
          })  //  返回定位信息
          AMap.event.addListener(geolocation, 'error', (result) => {
            console.log('error:',result)
          })  //  返回定位出错信息
        });

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
       //屏幕可视高度
      getWindowHeight() {
        var windowHeight = 0;
        if (document.compatMode == "CSS1Compat") {
          windowHeight = document.documentElement.clientHeight;
        } else {
          windowHeight = document.body.clientHeight;
        }
        this.styleObject.height=windowHeight*1-171+'px';
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
            let _address = _obj.Province+'-'+_obj.City+'-'+_obj.county+'-'+_obj.address;
            let address = _address +'/'+'address';
            this.setuserInfo(address);
          }
          if(_obj.lat){
              let locationY = _obj.lat +'/'+'locationY';
              this.setuserInfo(locationY);
          }
          if(_obj.lng){
              let locationX = _obj.lng +'/'+'locationX';
              this.setuserInfo(locationX);
          }
          if(this.$route.query.ind == 2){
            this.$router.push({path: this.goback,query:_obj});
          }else{
            this.$router.push({path: this.goback,query:_obj});
          }
          
        }
      }
    },
    created:function(){
      this.getWindowHeight();
      if(this.$route.query.ind == 1){
        this.goback = 'settlein'
      }else if(this.$route.query.ind == 2){
        this.goback = 'manage'
      }
    }
  }
</script>

<style lang="less">
@import "mint-ui/lib/style.css";
@import url(../../common/css/common.css);
  .shopMap {
    .mint-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
    }
    .shopMap_cont{
      padding-top: 80px;
      .map{
        width: 100%;
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
          width:100%;
          background: #fff;
          position:absolute;
          left:0;
          bottom:0;
        }
      }
    }
  }
</style>
