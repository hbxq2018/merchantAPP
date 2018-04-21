<template>
    <div class="income">
		<mt-header title="营业数据" class="income_header">
            <router-link to="/" slot="left">
                <mt-button icon="back"></mt-button>
                <mt-button></mt-button>
            </router-link>
            <router-link to="" slot="right">
                <mt-button class="income_header_date">今日</mt-button>
            </router-link>
		</mt-header>
        <div class="income_banner">
            <div class="income_banner_data">
                <p class="income_data_num">￥909</p>
                <p>营业额</p>
            </div>
            <div class="income_banner_data">
                <p class="income_data_num">9</p>
                <p>核销券数</p>
            </div>
        </div>
        <div class="income_operate">
            <div class="income_operate_result">
                <p>2018-04</p>
                <p>
                    <span>营业额：￥30215.50</span>
                    <span>核销券数：286张</span>
                </p>
            </div>
            <div class="income_operate_time">
                <img src="../common/images/calendar.png" alt="">
            </div>
        </div>
        <div class="income_list">
            <ul>
                <li class="income_li">
                    <div class="income_li_l">
                        <div class="face_value">
                            10元
                        </div>
                    </div>
                    <div class="income_li_r">
                        <div class="income_amount">
                            <p>消费金额</p>
                            <p>￥122</p>
                        </div>
                        <div class="income_date">2018-04-18 12:45:23</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
  name: "Income",
  data() {
    return {};
  },
  watch: {},
  created: function() {},
  methods: {},
  computed: {},
  updated: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.income {
  p {
    margin: 0;
  }
  width: 100%;
  height: 100%;
  font-family: "微软雅黑";
  position: relative;
  font-size: 30px;
  .income_header {
    width: 100%;
    height: 88px;
    background-color: #fc5e2d;
    font-size: 34px;
    line-height: 88px;
    .income_header_date {
        font-size: 28px;
    }
  }
  .income_banner {
    background-color: #fc5e2d;
    display: flex;
    height: 264px;
    color: #fff;
    .income_banner_data {
      flex: direction-flex;
      width: 50%;
      height: 100%;
      padding-top: 60px;
      box-sizing: border-box;
      p {
        font-size: 30px;
      }
      .income_data_num {
        margin-bottom: 20px;
        font-size: 54px;
      }
    }
  }
  .income_operate {
    height: 120px;
    padding: 20px 41px;
    box-sizing: border-box;
    background-color: #ebebeb;
    display: flex;
    & > div {
      flex: direction-flex;
      justify-content: space-between;
    }
    .income_operate_result {
      text-align: left;
      width: 90%;
      p:first-child {
        font-size: 32px;
        color: #1f1f1f;
      }
      p:last-child {
        font-size: 24px;
        color: #808080;
        span:first-child {
            margin-right: 39px;
        }
      }
    }
    .income_operate_time {
      text-align: right;
      width: 10%;
      img {
        margin-top: 15px;
        width: 47px;
        height: 47px;
      }
    }
  }
  .income_list {
    background-color: #fff;
    ul {
        padding: 0;
        margin: 0;
        li {
            display: flex;
            padding: 16px 40px;
            box-sizing: border-box;
            text-align: left;
            & > div {
                flex: direction-flex;
                justify-content: space-between;
            }
            .income_li_l {
                width: 18%;
                .face_value {
                    height: 90px;
                    width: 90px;
                    background-color: #FC5E2D;
                    border-radius: 50%;
                    color: #fff;
                    text-align: center;
                    line-height: 90px;
                    font-size: 32px;
                }
            }
            .income_li_r {
                width: 82%;
                .income_amount {
                    display: flex;
                    padding: 5px 0 12px 0;
                    box-sizing: border-box;
                    p {
                        flex: direction-flex;
                        justify-content: space-between;
                        font-size: 30px;
                        color:#1F1F1F;
                        font-weight: 600;
                    }
                    p:first-child {
                        width: 80%;

                    }
                    p:last-child {
                        width: 20%;
                        text-align: right;
                        color:#FC5E2D;
                    }
                }
                .income_date {
                    font-size: 26px;
                    color:#929292;
                }
            }
        }
    }
  }
}
</style>