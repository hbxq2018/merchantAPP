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
            <img class="man_src" :src="item.src" :alt="item.name">
           <span class="man_name">{{item.name}}</span>
           <span class="nam_del" @click="clickdel" :id="index">删除</span>
          </li>
      </ul>
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
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
          value: "13398572409"
        },
        {
          name: "经营品类",
          to: "/edit",
          value: "火锅 川菜 自助餐"
        },
        {
          name: "环境分类",
         to: "/edit",
          value: "约会"
        },
        {
          name: "详细地址",
          to: "/edit",
          value: "详细地址详细地址详细地址详细地址详细地址详细地址"
        },
        {
          name: "店铺简介",
         to: "/edit",
          value: "店铺简介店铺简介店铺简介店铺简介"
        }
      ],
      writedata: [
        {
          src: "../../../../static/images/timg (2).jpg",
          name: "张三"
        },
        {
          src: "../../../../static/images/timg (2).jpg",
          name: "李四"
        },
        {
          src: "../../../../static/images/timg (2).jpg",
          name: "王五"
        }
      ]
    };
  },
  methods: {
    save: function() {
      console.log("formdata:",this.formdata)
      MessageBox.confirm('确定进行保存?').then(action => {
        MessageBox('提示', '保存成功');
      },() => {
        MessageBox('提示', '是否放弃保存修改内容？');
      });
    },
    clickformli:function(e){
      const ind = e.currentTarget.id;
      console.log("ind:",ind);
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
          if(!value){
            MessageBox('提示', '请输入核销员编号');
            return false
          }
          let obj = {
              src: "../../../../static/images/timg (2).jpg",
              name: ""
          }
          obj.name = value
          this.writedata.push(obj)
        }
      },()=>{});
    },
    clickdel: function(e) {
      const ind = e.currentTarget.id;
      MessageBox.confirm('确定要删除吗？?').then(action => {
        let [...arr] = this.writedata
        if(action == 'confirm'){
          arr.splice(ind,1)
          this.writedata = arr
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
    }
  },
  created:function(){
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
  .mint-msgbox-title{
      font-size: 30px!important;
      margin: 29px 0;
  }
  // .mint-msgbox {
  //   height: 25%;
  //   .mint-msgbox-header {
  //     height: 75px;
  //     .mint-msgbox-title {
  //       color: 30px;
  //       margin: 29px 0;
  //     }
  //   }
  // }
}
</style>


