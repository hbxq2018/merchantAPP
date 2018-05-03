<template>
  <div class="manage">
      <mt-header :title="name">
        <router-link to="/home" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button slot="right" @click="save">保存</mt-button>
      </mt-header>

      <div class="man_info">商户信息</div>

      <mt-cell v-for="(item,index) in formdata" :key="index" :id='index' :title="item.name" :to="{path:'edit',query:{'ind':index,'name':item.name,'value':item.value}}" is-link :value="setvalue(item.value)" @click="clickformli"></mt-cell>
      
      <div class="man_info">员工管理</div>

      <div class="hexiaoyuan">
          <i class="man_hexiao">核销员</i>
          <i class="man_add" @click="clickadd">+添加</i>
      </div>
      <ul class="man_write" v-if="writedata">
          <li class="man_lis" v-for="(item,index) in writedata" :key="index" >
            <img class="man_src" :src="item.iconUrl" :alt="item.name">
           <span class="man_name">{{set(item)}}</span>
           <span class="nam_del" @click="clickdel" :id="index">删除</span>
          </li>
      </ul>
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
import store from '@/vuex/store'
import {mapState,mapMutations} from 'vuex';
export default {
  name: "Manage",
  data() {
    return {
      msg: "店铺管理",
      name: "恩施映像",
      formdata: [
        {
          name: "联系电话",
          to: "/edit",
          value: ""
        },
        {
          name: "经营品类",
          to: "/edit",
          value: ""
        },
        {
          name: "环境分类",
         to: "/edit",
          value: ""
        },
        {
          name: "详细地址",
          to: "/edit",
          value: ""
        },
        {
          name: "店铺简介",
         to: "/edit",
          value: ""
        }
      ],
      writedata:[]
    }
  },
  store,
  computed:{
    ...mapState(['userInfo']),
  },
  methods: {
    ...mapMutations(['setuserInfo']),
    set:function(val){
      if(val.nickName){
        return val.nickName
      }else if(val.userName){
        let name =  val.userName.substr(0,3)+"****"+val.userName.substr(7);  
        return name 
      }
    },
    save: function() {
      let userdata = this.userInfo;
      MessageBox.confirm('确定进行保存?').then(action => {
        let obj = {
          id:userdata.id,
          phone:userdata.phone,
          mobile:userdata.mobile,
          address:userdata.address,
          shopInfo:userdata.shopInfo,
          locationX:userdata.locationX,
          locationY:userdata.locationY,
          businessCate:userdata.businessCate
        }
        let _value='';
        for(var key in obj) {
          _value += key + '=' + obj[key] + '&';
        }
        _value = _value.substring(0, _value.length-1);
        this.$axios.post('/api/app/shop/update?'+_value)
        .then((res) => {
          if(res.data.code == '0'){
            MessageBox('提示', '保存成功');
            this.getshopinfo();
          }
        })
      },() => {
        MessageBox('提示', '是否放弃保存修改内容？');
      });
    },
    getshopinfo:function(){ //获取商家信息
      let shopId = '144'
      this.$axios.get('/api/shop/get/'+shopId)
      .then((res) => {
        if(res.data.code ==  '0'){
          let data = res.data.data;
          this.setuserInfo(data)
        }
      })
    },
    clickformli:function(e){
      const ind = e.currentTarget.id;
      let obj={};
      for(let i=0;i<this.formdata.length;i++){
        if(ind == this.formdata[i].id){
          obj = this.formdata[i]
          this.$router.push({name:'/edit',params:{id:obj.id,name:obj.name}})
        }
      }
    },
    clickadd: function() {
      MessageBox.prompt("添加核销员").then(({ value, action }) => {
        if(action == 'confirm'){
          let obj = {
              src: "../../../../static/images/timg (2).jpg",
              name: ""
          }
          if(value){
            const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!reg.test(value)) {
              MessageBox('提示', '手机号输入错误');  
              return false;  
            }
            let shopId='144';
            let obj = {
              shopId:shopId,
              mobile:value
            }
            let _value='';
            for(var key in obj) {
              _value += key + '=' + obj[key] + '&';
            }
            _value = _value.substring(0, _value.length-1);
            this.$axios.post('/api/app/user/addHxUser?'+_value)
            .then((res) => {
              if(res.data.code == '0'){
                this.getWritelist(1)
              }else{
                MessageBox('提示', res.data.message);  
              }
            })
          }else{
            MessageBox('提示', '请输入核销员手机号');
          }
        }
      },()=>{});
    },
    clickdel: function(e) {
      const ind = e.currentTarget.id;
      MessageBox.confirm('确定要删除吗？').then(action => {
        let [...arr] = this.writedata
        if(action == 'confirm'){
          let obj = {
            shopId:'144',
            mobile:arr[ind].mobile
          }
          let _value='';
          for(var key in obj) {
            _value += key + '=' + obj[key] + '&';
          }
          _value = _value.substring(0, _value.length-1);
          this.$axios.post('/api/app/user/deleteHxUser?'+_value)
          .then((res) => {
            if(res.data.code == '0'){
              this.getWritelist(2)
            }
          })
        }
      },()=>{});
    },
    setvalue:function(val){
      if(val.length>13){
        let str = val.substring(0,13) + '...';
        return str
      }else{
        return val
      }
    },
    getWritelist:function(val){  //获取核销员列表
      let shopId = '144'
      this.$axios.post('/api/app/user/listForShopId?shopId='+shopId)
      .then((res) => {
        if(res.data.code ==  '0'){
          this.writedata = res.data.data;
          if(val == '1'){
            MessageBox('提示', '添加成功')
          }else if(val == '2'){
            MessageBox('提示', '删除成功')
          };
        }
      })
    },
    setformdata:function(){
      if(this.userInfo){
        let userdata = this.userInfo;
        console.log("userdata:",userdata)
        let ind = userdata.businessCate.indexOf("/");
        let val1 = userdata.businessCate.slice(0,ind);
        let val2 = userdata.businessCate.slice(ind+1,userdata.businessCate.length);
        this.name = userdata.shopName;
        this.formdata[0].value = userdata.phone?userdata.phone:userdata.mobile;
        this.formdata[1].value = val1;
        this.formdata[2].value = val2;
        this.formdata[3].value = userdata.address;
        this.formdata[4].value = userdata.shopInfo;
      }
    }
  },
  created:function(){
    if(this.writedata.length<1){
      this.getWritelist()
    }

    if(!this.formdata[0].value){
      this.setformdata();
    }
    
    // console.log("this.$route.params.name:",this.$route.params)
    if(this.$route.params.ind){
      let obj = this.$route.params
      this.formdata[obj.ind].value = obj.value
    }
  }
};
</script>
<style lang="less">
.manage {
  .man_info {
    background: #ebebeb;
    height: 68px;
    line-height: 68px;
    text-align: left;
    padding-left: 20px;
    font-size: 28px;
    color: #b1b1b1;
  }

  .hexiaoyuan {
    padding: 29px 20px;
    border-bottom: 1px solid #e0e0e0;
    height: 40px;
    i {
      font-style: normal;
    }
    .man_hexiao {
      float: left;
      color: #191919;
      font-size: 30px;
    }
    .man_add {
      float: right;
      font-size: 30px;
      color: #fc5e2d;
      height: 100%;
    }
  }
  .man_write {
    padding: 0;
    .man_lis {
      list-style-type: none;
      height: 60px;
      padding: 20px;
      .man_src {
        width: 66px;
        height: 66px;
        border-radius: 50%;
        float: left;
      }
      span {
        line-height: 60px;
        color: #808080;
      }
      .man_name {
        float: left;
        margin-left: 20px;
      }
      .nam_del {
        float: right;
      }
    }
  }
}
</style>


