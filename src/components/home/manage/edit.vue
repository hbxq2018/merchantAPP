<template>
  <div class="edit">
      <mt-header fixed :title="name">
        <mt-button slot="left" icon="back" @click="clickback"></mt-button>
        <!-- <mt-button slot="right"  @click="save">保存</mt-button> -->
      </mt-header> 
      <div class="edit_content">
        <div class="cont_top" v-if="ind == '0'">
          <mt-field class="indleft" v-model="data.mobile" label="手机电话" placeholder="请输入手机号码" ref="mobile" type="tel" ></mt-field>
          <mt-field class="indleft" v-model="data.phone" label="座机电话" placeholder="请输入座机号码" ref="phone" type="tel" ></mt-field>
          <div class="legend">座机号码和手机号码，请正确输入至少一个联系方式</div>
        </div>
  
        <div class="category">
          <ul>
            <li v-for="(item,index) in options" :key="index" :id="item.id" class="category_item clearfix">
              <span class="fl">{{item.label}}</span>
              <i class="fr" :class="item.checked ? 'checked' : ''" @click="ischecked(index)"></i>
            </li>
          </ul>
        </div>

        <mt-field class="indright" v-show="ind == 4" v-model="data.Introduction" placeholder="商家简介" type="textarea" rows="8"></mt-field>
      </div> 
  </div>
</template>
<script>
import { Field, Checklist, Toast,MessageBox } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Edit",
  data() {
    return {
      name: "",
      ind: "",
      content: "",
      _max: "",
      data: {
        phone: "",
        mobile:"",
        Introduction: ""
      },
      value: [],
      checkedArr: [],
      options: [],
      option1: [
        {
          label: "料理",
          checked: false
        },
        {
          label: "自助餐",
          checked: false
        },
        {
          label: "湖北菜",
          checked: false
        },
        {
          label: "川菜",
          checked: false
        },
        {
          label: "湘菜",
          checked: false
        },
        {
          label: "粤菜",
          checked: false
        },
        {
          label: "咖啡厅",
          checked: false
        },
        {
          label: "小龙虾",
          checked: false
        },
        {
          label: "火锅",
          checked: false
        },
        {
          label: "海鲜",
          checked: false
        },
        {
          label: "烧烤",
          checked: false
        },
        {
          label: "江浙菜",
          checked: false
        },
        {
          label: "其它美食",
          checked: false
        }
      ],
      option2: [
        {
          label: "商务",
          checked: false
        },
        {
          label: "聚会",
          checked: false
        },
        {
          label: "约会",
          checked: false
        }
      ]
    };
  },
  store,
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    ...mapMutations(["setuserInfo"]),
    clickback: function() {
      const ind = this.ind;
      if (ind == 0) {
        if(this.data.mobile || this.data.phone){
          let ismobile = true,isphone=true;
          const reg = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
          const reg2 = /^0(([1-9]\d)|([3-9]\d{2}))\d{8}$/;
          
          if(this.data.mobile){
            ismobile= false;
            if (reg.test(this.data.mobile)) {
              ismobile=true;
              let mobile = this.data.mobile + "/" + "mobile";
              this.setuserInfo(mobile);
            } else {
              this.data.mobile = "";
              Toast("手机号码输入有误，请重新输入");
              let mobile = this.data.mobile + "/" + "mobile";
              this.setuserInfo(mobile);
            }
          }
          
          if(this.data.phone){
            isphone=false;
            if (reg2.test(this.data.phone)) {
              isphone=true;
              let phone = this.data.phone + "/" + "phone";
              this.setuserInfo(phone);
            } else {
              this.data.phone = "";
               Toast("座机号码输入有误，请重新输入");
              let phone = this.data.phone + "/" + "phone";
              this.setuserInfo(phone);
            }
          }
          
          setTimeout(() => {
              if(ismobile && isphone){
                this.$router.push({ name: "Manage", params: {} });
              }
          }, 1000);
          
        }else{
          Toast("请正确输入至少一个联系电话");
          return false
        }
        
      }else if (ind == 1) {
        let arr = [];
        for (let i = 0; i < this.checkedArr.length; i++) {
          arr.push(this.checkedArr[i].label);
        }
        let val = arr.join(",");
        val += "1";
        let businessCate = val + "/" + "businessCate";
        this.setuserInfo(businessCate);
        this.$router.push({ name: "Manage", params: {} });
      } else if (ind == 2) {
        // let val = this.value.join(",");
        let val = this.checkedArr[0].label;
        val += "2";
        let businessCate = val + "/" + "businessCate";
        this.setuserInfo(businessCate);
        this.$router.push({ name: "Manage", params: {} });
      } else if (ind == 3) {
        this.$router.push({ name: "Manage", params: {} });
      } else if (ind == 4) {
        let shopInfo = this.data.Introduction + "/" + "shopInfo";
        this.setuserInfo(shopInfo);
        this.$router.push({ name: "Manage", params: {} });
      }
    },
    ischecked(idx) {
      //是否勾选
      if (this.ismin) {
        if (this.options[idx].checked == false && this.checkedArr.length >= 1) {
          Toast("最多选择一项");
          return false;
        }
      } else {
        if (this.options[idx].checked == false && this.checkedArr.length >= 3) {
          Toast("最多选择三项");
          return false;
        }
      }

      this.options[idx].checked = !this.options[idx].checked;
      if (this.options[idx].checked == true) {
        this.checkedArr.push(this.options[idx]);
      } else if (this.options[idx].checked == false) {
        for (let i = 0; i < this.checkedArr.length; i++) {
          if (this.options[idx].label == this.checkedArr[i].label) {
            this.checkedArr.splice(i, 1);
          }
        }
      }
    },
    //保存修改信息
    save: function() {
      const ind = this.ind;
      let _this = this;
      if (ind == 0) {
        if(this.data.mobile || this.data.phone){
          const reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
          const reg2 = /^0(([1-9]\d)|([3-9]\d{2}))\d{8}$/;
          if(this.data.mobile){
            if (reg.test(this.data.mobile)) {
              let mobile = this.data.mobile + "/" + "mobile";
              this.setuserInfo(mobile);
            } else {
              Toast("手机号码输入有误，请重新输入");
              this.data.phone = "";
            }
          }
          if(this.data.phone){
            if (reg2.test(this.data.phone)) {
              let phone = this.data.phone + "/" + "phone";
              this.setuserInfo(phone);
            } else {
              Toast("座机号码输入有误，请重新输入");
              this.data.phone = "";
            }
          }
        }else{
          Toast("请正确输入至少一个联系电话");
          return false
        }
        
      } else if (ind == 1) {
        let arr = [];
        for (let i = 0; i < this.checkedArr.length; i++) {
          arr.push(this.checkedArr[i].label);
        }
        let val = arr.join(",");
        val += "1";
        let businessCate = val + "/" + "businessCate";
        this.setuserInfo(businessCate);
      } else if (ind == 2) {
        // let val = this.value.join(",");
        let val = this.checkedArr[0].label;
        val += "2";
        let businessCate = val + "/" + "businessCate";
        this.setuserInfo(businessCate);
      } else if (ind == 3) {
      } else if (ind == 4) {
        let shopInfo = this.data.Introduction + "/" + "shopInfo";
        this.setuserInfo(shopInfo);
        this.$router.push({ name: "Manage", params: {} });
      }
      let userdata = this.userInfo;
      MessageBox.confirm("确定进行保存?").then(
        action => {
          let obj = {
            id: userdata.id,
            phone: userdata.phone,
            mobile: userdata.mobile,
            address: userdata.address,
            shopInfo: userdata.shopInfo,
            locationX: userdata.locationX,
            locationY: userdata.locationY,
            businessCate: userdata.businessCate
          };
          let _value = "";
          for (var key in obj) {
            _value += key + "=" + obj[key] + "&";
          }
          _value = _value.substring(0, _value.length - 1);
          this.$axios.post("/api/app/shop/update?" + _value).then(res => {
            if (res.data.code == "0") {
              Toast({
                message: '保存成功',
                duration: 2000
              });
              setTimeout(function(){
                _this.$router.push({ name: "Manage", params: {} });
              },2000)
            }
          });
        },
        () => {
          MessageBox("提示", "是否放弃保存修改内容？");
        }
      );
    }
  },
  watch: {
    value: function(value) {
      this.value = value;
    }
  },
  created: function() {
    this.name = this.$route.query.name;
    this.ind = this.$route.query.ind;
    this.content = this.$route.query.value;
    this.data.mobile = this.userInfo.mobile;
    this.data.phone = this.userInfo.phone;
    if (this.ind == 0) {
        const reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
        const reg2 = /^0(([1-9]\d)|([3-9]\d{2}))\d{8}$/;
        if (reg.test(this.content)) {
          this.data.mobile = this.content;
        }
        if (reg2.test(this.content)) {
          this.data.phone = this.content;
        }
      
    }
    if (this.ind == 1) {
      this.options = this.option1;
      this.ismin = false;
      this.content = this.content.split(",");
      for (let i = 0; i < this.content.length; i++) {
        for (let j = 0; j < this.option1.length; j++) {
          if (this.content[i] == this.option1[j].label) {
            this.option1[j].checked = true;
            this.checkedArr.push(this.option1[j]);
          }
        }
      }
      this.value = this.content;
    } else if (this.ind == 2) {
      this.ismin = true;
      for (let i = 0; i < this.option2.length; i++) {
        if (this.option2[i].label == this.content) {
          this.option2[i].checked = true;
          this.checkedArr.push(this.option2[i]);
        }
      }
      this.options = this.option2;
      this.value = this.content;
    } else if (this.ind == 3) {
      this.$router.push({ path: "/shopMap", query: { ind: "2" } });
    } else {
      this.data.Introduction = this.content;
    }
  }
};
</script>
<style lang="less">
.edit {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: scroll;
  .edit_content {
    .cont_top{
      margin-top: 80px;
    }
    
    .legend{
      margin-top: 50px;
    }
    .mint-cell-title,
    .mint-cell-text {
      width: 130px;
    }
    .indleft input{
     text-align: right;
    }
    .indright input{
      text-align: left;
    }
    .category {
      ul {
        margin: 0;
        padding: 0;
        .category_item {
          height: 100px;
          line-height: 100px;
          padding: 0 30px;
          border-bottom: 1px solid #e0e0e0;
          span {
            font-size: 28px;
          }
          i {
            display: inline-block;
            width: 42px;
            height: 42px;
            margin-top: 30px;
            background-size: 42px 42px;
          }
        }
      }
    }
  }
}
</style>


