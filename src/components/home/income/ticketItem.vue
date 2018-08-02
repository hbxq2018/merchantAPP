<template>
    <div class="ticket_item">
        <div class="ticket_name">{{ticketObj.name}}</div>
        <div class="ticket_info">
            <div class="item_key">
                <div>券码:</div>
                <div>券状态:</div>
                <div>服务费:</div>
                <div>核销时间:</div>
            </div>
            <div class="item_val">
                <div>{{ticketObj.orderNum}}</div>
                <div>已核销</div>
                <div>{{ticketObj.maney}}元</div>
                <div>{{ticketObj.date}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import store from "@/vuex/store";
export default {
  name: "TicketItem",
  props: {
    obj: Object
  },
  data() {
    return {
      ticketObj: this.obj
    };
  },
  created: function() {},
  components: {},
  watch: {},
  store,
  methods: {}
};
</script>

<style lang="less">
.ticket_item {
  height: 226px;
  border-radius: 8px;
  background-color: #fff;
  padding: 18px 0 0 26px;
  box-sizing: border-box;
  text-align: left;
  margin-bottom: 20px;
  .ticket_name {
    color: #191919;
    font-size: 30px;
    margin-bottom: 16px;
  }
  .ticket_info {
    font-size: 22px;
    color: #555555;
    display: flex;
    flex-direction: row;
    .item_key {
      margin-right: 36px;
      div {
        padding-bottom: 6px;
      }
    }
    .item_val {
      div {
        padding-bottom: 6px;
      }
    }
  }
}
</style>