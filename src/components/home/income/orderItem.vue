<template>
    <li class="order_item" @click="toDetail">
      <div class="list_item_l">
          <div>{{orderList.hxTime}}</div>
          <div class="item_money">￥{{orderList.realAmount}}</div>
      </div>
      <div class="list_item_r">
          <div class="item_key" :class="orderList.skuName ? '' : 'active'">
              <div>订单号</div>
              <div>付款人</div>
              <div v-if="orderList.skuName">代金券</div>
          </div>
          <div class="item_val" :class="orderList.skuName ? '' : 'active'">
              <div>{{orderList.id}}</div>
              <div>{{orderList.mobile}}</div>
              <div v-if="orderList.skuName">{{orderList.skuName}}</div>
          </div>
      </div>
    </li>
</template>

<script>
import Vue from "vue";
import store from "@/vuex/store";
export default {
  name: "OrderItem",
  props: {
    obj: Object
  },
  data() {
    return {
      orderList: this.obj
    };
  },
  created: function() {
    
  },
  components: {
    
  },
  watch: {},
  store,
  methods: {
    toDetail() {
      
    }
  }
};
</script>

<style lang="less">
.order_item {
  height: 156px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 22px;
  background-color: #fff;
  color: #b1b1b1;
  padding: 0 46px 0 30px;
  text-align: left;
  margin-bottom: 20px;
  .list_item_l {
    padding-top: 32px;
    .item_money {
      color: #191919;
      font-size: 50px;
      margin-left: -10px;
      margin-top: 6px;
    }
  }
  .list_item_r {
    display: flex;
    flex-direction: row;
    padding-top: 20px;
    .item_key {
      margin-right: 22px;
      div {
        margin-bottom: 16px;
      }
      &.active {
        margin-top: 20px;
      }
    }
    .item_val {
      div {
        margin-bottom: 16px;
      }
      &.active {
        margin-top: 20px;
      }
    }
  }
}
</style>