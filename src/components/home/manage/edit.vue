<template>
  <div class="edit">
      <mt-header :title="name">
        
        <mt-button slot="left" icon="back" @click="clickback"></mt-button>
        
      </mt-header>  
      <mt-field v-show="ind == '0'" v-model="data.phone" label="手机号" placeholder="请输入新手机号" ref="phone" type="tel" ></mt-field>
      
        <mt-checklist  
            v-if="ind == '1' || ind == '2'" 
            :max="_max"
            align="right"
           
            v-model="value"   
            :options="options">  
        </mt-checklist> 

        <mt-field v-show="ind == 4"  label="简介" v-model="data.Introduction" placeholder="商家简介" type="textarea" rows="8"></mt-field>
  </div>
</template>
<script>
import { Field } from "mint-ui";
import { Checklist } from "mint-ui";
import { Toast } from 'mint-ui';

export default {
   
  name: "Name",
  data() {
    return {
      name:'',
      ind:'',
      content:'',
      _max:'',
      data:{
          phone:'',
          Introduction:''
      },
      value: [],
      options:[],
      option1: [
        {
          label: "日本菜",
          value: "日本菜"
        },
        {
          label: "自助餐",
          value: "自助餐"
        },
        {
          label: "湖北菜",
          value: "湖北菜"
        },
        {
          label: "川菜",
          value: "川菜"
        },
        {
          label: "湘菜",
          value: "湘菜"
        },
        {
          label: "粤菜",
          value: "粤菜"
        },
        {
          label: "咖啡厅",
          value: "咖啡厅"
        },
        {
          label: "小龙虾",
          value: "小龙虾"
        },
        {
          label: "火锅",
          value: "火锅"
        },
        {
          label: "海鲜",
          value: "海鲜"
        },
        {
          label: "烧烤",
          value: "烧烤"
        },
        {
          label: "江浙菜",
          value: "江浙菜"
        },
        {
          label: "其它美食",
          value: "其它美食"
        }
      ],
      option2:[
        {
          label: "商务",
          value: "商务"
        },
        {
          label: "聚会",
          value: "聚会"
        },
        {
          label: "约会",
          value: "约会"
        }
      ]
    };
  },
  methods: {
    clickback: function() {
      const ind = this.ind;
      if (ind == 0) {
        const reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
        if (reg.test(this.data.phone)) {
           this.$router.push({name: 'Manage',params:{ ind:this.ind,value:this.data.phone}});
        //    this.$router.go(-1) //返回上一页面
        }else{
            Toast('手机号码输入有误，请重新输入');
            this.data.phone = '';
            return false
        }
      }else if(ind == 1 || ind == 2){
        let val = this.value.join(",");
        this.$router.push({name: 'Manage',params:{ ind:this.ind,value:val}});
      }else if(ind == 3){
        this.$router.push({name: 'Manage',params:{}});
      }else if(ind == 4){
        this.$router.push({name: 'Manage',params:{ ind:this.ind,value:this.data.Introduction}});
      }
    }
  },
  watch: {
    value: function(value) {
        this.value = value
    }
  },
  created: function() {
    this.name = this.$route.query.name;
    this.ind = this.$route.query.ind;
    this.content = this.$route.query.value;
    if(this.ind == '0'){
      this.data.phone = this.content;
    }
    if(this.ind=='1'){
        this.options = this.option1;
        this._max = 3;
        this.content = this.content.split(" ")
        this.value = this.content;
    }else if(this.ind == '2'){
        this.options = this.option2;
        this._max = 1;
        this.content = this.content.split(" ")
        this.value = this.content;
    }else{
      this.data.Introduction = this.content;
    }
  }
};
</script>
<style lang="less" scoped>
  .edit{
    .mint-cell-title,.mint-cell-text{
      width: 300px;
    }
    .mint-field-core{
      border: 1px solid #b1b1b1!important;
    }
  }
</style>
