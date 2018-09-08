<template>
    <div class="editList">
        <mt-header fixed title="编辑砍价拼菜说明">
            <mt-button slot="left" icon="back" @click="clickback(1)"></mt-button>
            <mt-button slot="right" @click="clickback(2)">保存</mt-button>
        </mt-header>
        <div class="editbj"></div>
        <div class="poputDiv">
            <div class="popupLi" v-for="(item,index) in Infos" :key="index">
                <textarea class="popuArea" name="textarea" id="textarea" cols="15" rows="3" placeholder="请输入详情说明" v-model="item._value"></textarea>
                <div class="aDbut">
                    <div class="butLeft" :id="index" @click="DelNext">
                        <img src="../../../../static/images/cancelIcon.png" alt="删除">
                        删除该组</div>
                    <div class="butRight" :id="index" @click="addNext">
                        <img src="../../../../static/images/addIcon.png" alt="删除">
                        添加一组</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Toast, MessageBox } from "mint-ui";
export default {
  name: "editlist",
  data() {
    return {
      Infos: [{ _value: "" }],
      oldInfo: "",
      dishId: "",
      isCut:true
    };
  },
  methods: {
    //返回上一页面
    clickback: function(val) {
      let _info = "";
      if (this.Infos[0]._value) {
        for (let i = 0; i < this.Infos.length; i++) {
          _info += this.Infos[i]._value + "Œ";
        }
        _info = _info.substring(0, _info.length - 1);
      } else {
        _info = "1";
      }
      if (val == 1) {
        if (_info == this.oldInfo) {
          this.$router.push({
            name: "Cutedit",
            params: { info: this.oldInfo, id: this.dishId,isCut:this.isCut }
          });
        } else {
          let _str = "";
          MessageBox.confirm(
            "未保存，是否确定退出"
          ).then(action => {
            if (action == "confirm") {
              this.$router.push({
                name: "Cutedit",
                params: { info: this.oldInfo, id: this.dishId,isCut:this.isCut }
              });
            }
          });
        }
      } else if (val == 2) {
        this.$router.push({
          name: "Cutedit",
          params: { info: _info, id: this.dishId,isCut:this.isCut }
        });
      }
    },
    //增加一条详情说明
    addNext: function(e) {
      if (this.Infos[this.Infos.length - 1]._value) {
        this.Infos.push({ _value: "" });
      } else {
        Toast("请先填完上一项");
      }
    },
    // 删除一条详情说明
    DelNext: function(e) {
      let id = e.currentTarget.id,
        _len = this.Infos.length,
        arr = this.Infos;
      if (_len > 1) {
        for (let i = 0; i < _len; i++) {
          if (id * 1 === i * 1) {
            arr.splice(i, 1);
          }
        }
      } else {
        // Toast("仅剩一项了,不能再删了");
      }
    }
  },
  created: function() {
    if(this.$route.params.dishId){
       this.dishId = this.$route.params.dishId;
    }
    this.isCut = this.$route.params.isCut;
    if (this.$route.params.str) {
      let _skuInfo = this.$route.params.str;
      this.oldInfo = this.$route.params.str;
      
      if (_skuInfo) {
        this.Infos = [];
        if (_skuInfo.indexOf("Œ") == -1) {
          let obj = { _value: _skuInfo };
          this.Infos.push(obj);
        } else {
          let arr = _skuInfo.split("Œ");
          for (let i = 0; i < arr.length; i++) {
            let obj = { _value: arr[i] };
            this.Infos.push(obj);
          }
        }
      }
    }
  }
};
</script>

<style lang="less">
.editList {
  // position: fixed;
  width: 100%;
  height: 100%;
  background: #ebebeb;
  overflow: scroll;
  .editbj{
    width: 100%;
    height: 90px;
    margin-bottom: 20px;
  }
  .poputDiv {
    width: 690px;
    .popupLi {
      width: 100%;
      height: 220px;
      font-size: 40px;
      line-height: 80px;
      margin-top: 20px;
      margin-left: 30px;
      .popuArea {
        width: 660px;
        padding: 15px;
        height: 110px;
        border: none;
      }
      .aDbut {
        width: 100%;
        height: 82px;
        margin-top: -27px;
        background: #fafafa;
        border-top: 1px solid #e0e0e0;
        position: relative;
        img {
          width: 34px;
          height: 34px;
          position: relative;
          top: 5px;
          left: -5px;
        }
        .butLeft,
        .butRight {
          width: 49.5%;
          float: left;
          height: 82px;
          line-height: 82px;
          font-size: 30px;
        }
        .butLeft {
          color: #b1b1b1;
          border-right: 1px solid #e0e0e0;
        }
        .butRight {
          color: #fc5e2d;
        }
      }
    }
  }
}
</style>


