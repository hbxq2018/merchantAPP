<template>
  <div class="manage">
      <mt-header :title="name">
        <router-link to="/home" slot="left">
            <mt-button icon="back"></mt-button>
        </router-link>
        <mt-button slot="right" @click="save">保存</mt-button>
      </mt-header>

      <div class="man_info">商户信息</div>
      
      <mt-cell v-for="(item,index) in formdata" :key="index" :title="item.name" :to="item.to" is-link :value="item.value"></mt-cell>
      
      <div class="man_info">员工管理</div>

      <div class="hexiaoyuan">
          <i class="man_hexiao">核销员</i>
          <i class="man_add" @click="clickadd">+添加</i>
      </div>
      <ul class="man_write" v-if="writedata">
          <li class="man_lis" v-for="(item,index) in writedata" :key="index" >
            <img class="man_src" :src="item.src" :alt="item.name">
           <span class="man_name">{{item.name}}</span>
           <span class="nam_del" @click="clickdel">删除</span>
          </li>
      </ul>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
export default {
  name: "Manage",
  data() {
    return {
      msg: "店铺管理",
      name: "恩施映像",
      formdata: [
        {
          name: "联系电话",
          to: "",
          value: "13398572409"
        },
        {
          name: "经营品类",
          to: "",
          value: "火锅 川菜 自助餐"
        },
        {
          name: "环境分类",
          to: "",
          value: "约会"
        },
        {
          name: "详细地址",
          to: "",
          value: "光谷天地光谷天地光谷天地光..."
        },
        {
          name: "店铺简介",
          to: "",
          value: "光谷天地光谷天地光谷天地光..."
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
      console.log("save");
    },
    clickadd: function() {
        MessageBox.prompt('添加核销员').then(({ value, action }) => {
            console.log("value:",value)
            console.log("action:",action)
        });
    },
    clickdel: function() {
      console.log("clickdel");
    }
  }
};
</script>
<style lang="less">
.manage {
  padding-top: 88px;
  .mint-header {
    width: 100%;
    height: 88px;
    line-height: 88px;
    background-color: #fc5e2d;
    font-size: 34px;
    position: absolute;
    top: 0;
    left: 0;
    letter-spacing: 4px;
    .is-left {
      i {
        font-size: 44px;
      }
    }
  }
  .man_info {
    background: #ebebeb;
    height: 68px;
    line-height: 68px;
    text-align: left;
    padding-left: 20px;
    font-size: 28px;
    color: #b1b1b1;
  }
  .mint-cell {
    height: 100px;
    .mint-cell-wrapper {
      height: 100%;
      line-height: 100px;
      border-bottom: 1px solid #e0e0e0;
      .mint-cell-title {
        color: #191919;
        font-size: 30px;
        text-align: left;
      }
      .mint-cell-value.is-link {
        margin-right: 40px;
      }
      .mint-cell-value span {
        color: #808080;
        font-size: 30px;
      }
      .mint-cell-allow-right::after {
        width: 25px;
        height: 25px;
      }
    }
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


