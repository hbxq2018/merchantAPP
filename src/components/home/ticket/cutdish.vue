<template>
    <div class="cutdish">
        <mt-header fixed title="砍价拼菜">
            <mt-button slot="left" icon="back" @click="clickback"></mt-button>
            <mt-button slot="right" @click="addDish">+添加菜品</mt-button>
        </mt-header> 

        <div class="cutTop">
            <div :class="issell?'topLeft actTop':'topLeft'" @click="handTab(1)">出售中 ({{Ltotal}})</div>
            <div :class="!issell && isRight?'topRight actTop':'topRight'" @click="handTab(2)">已下架 ({{Rtotal}})</div>
        </div>

        <div class="cutdishcontent">
            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :autoFill="false" ref="cutmore">
                <ul v-if="dataList.length>0 && isRight">
                    <li class="cutItem" v-for="(item,index) in dataList" :key="index">
                        <div class="ItemLeft">
                            <img :src="item.picUrl" :class="issell?'itemImg':'itemImg obtImg'" alt="菜品图片">
                            <div v-if="!issell" class="already">已下架</div>
                        </div>
                        <div class="ItemRight">
                            <p class="dishName">{{item.skuName}}</p>
                            <p class="dishPrice">
                                <span class="lowPrice">底价：<em class="periceNum">¥{{item.agioPrice}}</em></span>
                                <span class="lowPrice">原价：<em class="periceNum">¥{{item.sellPrice}}</em></span>
                            </p>
                            <p class="inventory">
                                <span class="turnover">库存：<em class="turNum">{{item.stockNum}}</em></span>
                                <span class="turnover">销量: <em class="turNum">{{item.sellNum}}</em></span>
                            </p>
                            <div class="Itembut">
                                <div class="pushBut" v-if="!issell || isEdit" :id="item.id" @click="handEdit">编辑</div>
                                <div class="pushBut" :id="item.id" @click="handStand">{{issell?'下架':'上架'}}</div>
                                <!-- <button :id="item.id" @click="handEdit">编辑</button> -->
                                <!-- <button :id="item.id" @click="handStand">{{issell?'下架':'上架'}}</button> -->
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="saleDiv" v-if="issell && dataList.length == 0">
                    <p class="saleP">暂无菜品</p>
                    <mt-button class="saleB" @click="addDish">添加</mt-button>
                </div>
                 <img v-if="!issell && dataList.length == 0" class="empty" src="../../../../static/images/zhanweitu.png" alt="空空如也">
            </mt-loadmore>
        </div>
        
    </div>
</template>

<script>
import { Toast, Indicator, MessageBox } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
export default {
  name: "cutdish",
  data() {
    return {
      issell: true,//是否是上架状态
      isEdit:false,  //上架状态下是否可以编辑
      Insale: [], //出售中
      Obtained: [], //已下架
      page: 1,
      Ltotal: 0, //在售总量
      Rtotal: 0, //下架总量
      allLoaded: false,
      isRight: false,
      dataList: []
    };
  },
  store,
  computed: {
    ...mapState(["shopInfo", "userInfo"])
  },
  methods: {
    //点击左上角返回按钮
    clickback: function() {
      this.$router.push({ name: "Promotion", params: {} });
    },
    //点击添加菜品
    addDish: function() {
      this.$router.push({ name: "Cutedit", params: {} });
    },
    //顶部Tab
    handTab: function(val) {
      this.issell = val == 1 ? true : false;
      this.page = 1;
      this.dataList = [];
      this.allLoaded = false;
      this.getDatelist();
    },
    //点击编辑
    handEdit: function(e) {
      let _id = e.currentTarget.id;
      this.$router.push({ name: "Cutedit", params: { id: _id } });
    },
    //点击上下架
    handStand: function(e) {
      let that = this,_id = e.currentTarget.id,_parms = {},_value = "",str = "",_stockNum=15;
      str = this.issell?'是否确认下架？':'是否确认上架？';
      MessageBox.confirm(str).then(action => {
        if (action == "confirm") {
          for (let i = 0; i < this.dataList.length > 0; i++) {
            if (_id == this.dataList[i].id) {
              let _data = this.dataList[i];
              _parms = {
                skuName: _data.skuName,
                skuType: 6,
                stockNum:_stockNum,
                opreatorId: _data.opreatorId,
                opreatorName: _data.opreatorName,
                sellPrice: _data.sellPrice,
                inPrice: _data.inPrice,
                picUrl: _data.picUrl,
                agioPrice: _data.agioPrice,
                skuInfo: _data.skuInfo,
                shopId: _data.shopId,
                id: _id,
                isDeleted: this.issell ? "1" : "0" //0是在售  1是下架
              };
              for (var key in _parms) {
                _value += key + "=" + _parms[key] + "&";
              }
              _value = _value.substring(0, _value.length - 1);
              this.$axios.post("/api/app/sku/update?" + _value).then(res => {
                if (res.data.code == 0) {
                  Toast(this.issell?'下架成功':'上架成功');
                  this.page = 1;
                  this.allLoaded = false;
                  this.dataList = [];
                  if (this.issell) {
                    this.Rtotal++;
                  } else {
                    this.Ltotal++;
                  }
                  this.getDatelist();
                }
              });
            }
          }
        }
      });
      
    },
    //获取列表数据
    getDatelist: function() {
      Indicator.open("数据加载中...");
      let _parms = {},
        _value = "",
        isSuccess = false;
      _parms = {
        shopId: this.userInfo.id,
        zanUserId: this.shopInfo.id,
        page: this.page,
        rows: 10,
        isDeleted: this.issell ? "0" : "1" //0是在售  1是下架
      };
      for (var key in _parms) {
        _value += key + "=" + _parms[key] + "&";
      }
      _value = _value.substring(0, _value.length - 1);
      if (this.page == 1) {
        this.dataList = [];
      }
      setTimeout(() => {
        if (!isSuccess) {
          Indicator.close();
          Toast("网络异常，请检查网络连接");
        }
      }, Delay);

      this.$axios.get("/api/app/sku/kjcList?" + _value).then(res => {
        Indicator.close();
        isSuccess = true;
        if (res.data.code == 0) {
          let _data = res.data.data;
          if (this.issell) {
            this.Ltotal = _data.total;
          } else {
            this.Rtotal = _data.total;
          }
          if (!this.isRight) {
            return false;
          }
          if (_data && _data.list && _data.list.length > 0) {
            for (let j = 0; j < _data.list.length; j++) {
              this.dataList.push(_data.list[j]);
            }
          } else {
            Toast("没有更多数据了~~");
            this.allLoaded = true;
          }
        } else {
          Toast("没有更多数据了~~");
          this.allLoaded = true;
        }
      });
    },
    //下拉
    loadTop() {
      this.page = 1;
      this.allLoaded = false;
      this.dataList = [];
      this.getDatelist();
      this.$refs.cutmore.onTopLoaded();
    },
    //上拉
    loadBottom() {
      this.page += 1;
      this.getDatelist();
      this.$refs.cutmore.onBottomLoaded();
    },
    //查询在售中是否显示编辑按钮
    getisEdif(){ 
       this.$axios.get("/api/version.txt").then(res => {
         console.log('res:',res)
        // isAppEdit   为1不显示  为0显示
        this.isEdit = res.data.isAppEdit == 0?true:false;
        console.log('this.isEdit:',this.isEdit)
       })
    }
  },
  created: function() {
    this.page = 1;
    this.issell = false;
    this.getisEdif();
    this.getDatelist();
    setTimeout(() => {
      this.page = 1;
      this.issell = true;
      this.isRight = true;
      this.allLoaded = false;
      this.dataList = [];
      this.getDatelist();
    }, 500);
  }
};
</script>

<style lang="less">
.cutdish {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #ebebeb;
  overflow: scroll;
  .mint-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }
  .cutTop {
    width: 100%;
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: #b1b1b1;
    background: #fff;
    position: fixed;
    top: 80px;
    left: 0;
    z-index: 11;
    .topLeft,
    .topRight {
      width: 40%;
      margin-left: 5%;
      margin-right: 5%;
      float: left;
    }
    .actTop {
      color: #fc5e2d;
      border-bottom: 1px solid #fc5e2d;
    }
  }
  .cutdishcontent {
    width: 100%;
    margin-top: 1px;
    margin-top: 160px;
    .cutItem {
      width: 712px;
      height: 200px;
      padding: 20px 0px 20px 38px;
      margin-top: 20px;
      background: #fff;
      .ItemLeft,
      .ItemRight {
        float: left;
      }
      .ItemLeft {
        width: 200px;
        height: 200px;
        background: rgba(25, 25, 25, 1);
        border-radius: 8px;
        margin-right: 38px;
        position: relative;
        .itemImg {
          width: 200px;
          height: 200px;
          background: #fff;
          border-radius: 8px;
        }
        .obtImg {
          opacity: 0.4;
        }
        .already {
          width: 104px;
          height: 52px;
          position: relative;
          top: -134px;
          left: 52px;
          border-radius: 8px;
          color: #fff;
          border: 1px solid #fff;
          text-align: center;
          line-height: 52px;
          z-index: 10;
        }
      }
      .ItemRight {
        text-align: left;
        width: 474px;
        p {
          height: 40px;
          line-height: 40px;
          color: #191919;
          span:nth-child(1) {
            margin-right: 57px;
            em {
              margin-left: 10px;
            }
          }
          .periceNum {
            color: #fc4549;
          }
        }
        .dishName {
          font-size: 30px;
        }
        .dishPrice {
          font-size: 26px;
          color: #191919;
        }
        .inventory {
          font-size: 24px;
          color: #b1b1b1;
        }
        .Itembut {
          width: 100%;
          height: 100px;
          border-top: 1px solid #e0e0e0;
          margin-top: 5px;
          .pushBut {
            width: 130px;
            height: 52px;
            float: left;
            border-radius: 8px;
            color: #555;
            border: 2px solid #555;
            background: #fff;
            font-size: 24px;
            line-height: 52px;
            text-align: center;
            margin-top: 20px;
          }
          .pushBut:nth-child(1) {
            margin-right: 30px;
          }
        }
      }
    }
    .saleDiv {
      width: 100%;
      margin-top: 334px;
      color: #808080;
      .saleB {
        margin-top: 16px;
        width: 338px;
        height: 71px;
        background: #fc5e2d;
        color: #fff;
      }
    }
    .empty {
      width: 50%;
      margin-top: 40%;
    }
  }
}
</style>


