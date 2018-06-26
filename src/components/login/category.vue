<template>
  <div>
    <mt-header fixed :title="title">
        <div slot="left" @click="categoryTxt">
            <mt-button icon="back"></mt-button>
        </div>
    </mt-header>
    <div class="category">
      <ul>
        <li v-for="(item,index) in categoryArr" :key="index" :id="item.id" class="category_item clearfix">
          <span class="fl">{{item.name}}</span>
          <i class="fr" :class="item.checked ? 'checked' : ''" @click="ischecked(index)"></i>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Toast } from "mint-ui";
export default {
  name: "Category",
  data() {
    return {
      categoryArr: [],
      ismin: false,
      title:'',
      milieu: [
        { name: "商务", checked: false },
        { name: "聚会", checked: false },
        { name: "约会", checked: false }
      ],
      Category: [
        { name: "日本菜", checked: false },
        { name: "自助餐", checked: false },
        { name: "湖北菜", checked: false },
        { name: "川菜", checked: false },
        { name: "湘菜", checked: false },
        { name: "粤菜", checked: false },
        { name: "咖啡厅", checked: false },
        { name: "小龙虾", checked: false },
        { name: "火锅", checked: false },
        { name: "海鲜", checked: false },
        { name: "烧烤", checked: false },
        { name: "江浙菜", checked: false },
        { name: "西餐", checked: false },
        { name: "其它美食", checked: false }
      ],
      checkedArr: [] //选中的类目
    };
  },
  methods: {
    ischecked(idx) { //是否勾选
      if (this.ismin) {
        if (
          this.categoryArr[idx].checked == false &&
          this.checkedArr.length >= 1
        ) {
          Toast("最多选择一项");
          return false;
        }
      } else {
        if (
          this.categoryArr[idx].checked == false &&
          this.checkedArr.length >= 3
        ) {
          Toast("最多选择三项");
          return false;
        }
      }

      this.categoryArr[idx].checked = !this.categoryArr[idx].checked;
      if (this.categoryArr[idx].checked == true) {
        this.checkedArr.push(this.categoryArr[idx]);
      } else if (this.categoryArr[idx].checked == false) {
        for (let i = 0; i < this.checkedArr.length; i++) {
          if (this.categoryArr[idx].name == this.checkedArr[i].name) {
            this.checkedArr.splice(i, 1);
          }
        }
      }
    },
    categoryTxt() {
      if (this.checkedArr.length == 0) {
        Toast("请至少勾选一项");
        return false;
      }
      let txt = "";
      for (var i = 0; i < this.checkedArr.length; i++) {
        txt += this.checkedArr[i].name + ",";
      }
      txt = txt.substring(0, txt.length - 1);
      this.$router.push({ name: "Settlein", params: { category: txt,ismin:this.ismin } });
    }
  },
  created() {
    if (this.$route.params.id == 1) {
      this.categoryArr = this.Category;
      this.ismin = false;
      this.title = '经营品类'
    } else if (this.$route.params.id == 2) {
      this.categoryArr = this.milieu;
      this.ismin = true;
      this.title = '环境分类'
    }
    if (this.$route.params.txt) {
      let arr = this.$route.params.txt.split(",");
      for (let i = 0; i < arr.length; i++) {
        for (let k = 0; k < this.categoryArr.length; k++) {
          if (arr[i] == this.categoryArr[k].name) {
            this.categoryArr[k].checked = true;
            this.checkedArr.push(this.categoryArr[k]);
          }
        }
      }
    }
  }
};
</script>

<style lang="less">
.category {
  padding-top: 80px;
  ul {
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
        background: #fff url(../../../static/images/check.png) center center
          no-repeat;
        background-size: 42px 42px;
      }
      i.checked {
        background: #fff url(../../../static/images/checked.png) center center
          no-repeat;
        background-size: 42px 42px;
      }
    }
  }
}
</style>