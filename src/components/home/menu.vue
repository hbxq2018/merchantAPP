<template>
  <div class="menu">
      <div class="menu_top">
           <img class="eaves" src="../../../static/images/eaves.png" alt="顶部图片">
            <div class="info">
                <img class="avatar" :src='userdata.logoUrl' alt="用户头像">
                <div class="username">
                    <p class="u_name">
                        {{userdata.shopName}}
                    </p>
                    <p class="u_heat">
                        人气 {{userdata.popNum}}
                    </p>
                </div>
                <img src="../../../static/images/news.png" alt="消息" class="news">
            </div>
      </div>
      <div class="menu_content">
          <ul class="conul">
              <li class="conli" v-for="(item,index) in lidata" :key="index" :id="item.id" @click="clickli">
                <router-link :to="item.href">
                  <img :src="item.src" :alt="item.name">
                  <p class="con_name">{{item.name}}</p>
                  <p class="con_con">{{item.con}}</p>
                </router-link>
              </li>
          </ul>
      </div>
  </div>
</template>

<script>
import store from '@/vuex/store'
import {mapState,mapMutations,mapGetters} from 'vuex'
export default {
  name: "Menu",
  data() {
    return {
      msg: "menu",
      lidata:[
          {
              src:'../../../static/images/scan.png',
              id:'1',
              name:'扫码验证',
              con:'核销券票',
              href: '#'
          },{
              src:'../../../static/images/orders.png',
              id:'2',
              name:'营业数据',
              con:'核销记录、数据统计',
              href: 'income'
          },{
              src:'../../../static/images/stores.png',
              id:'3',
              name:'店铺管理',
              con:'更改店铺信息、员工管理',
              href: '#'
          },{
              src:'../../../static/images/voucher.png',
              id:'4',
              name:'享7券',
              con:'自定义满减额度',
              href: '#'
          }
      ],
      userdata: {}
    };
  },
  store,
  computed:{
    ...mapState(['userInfo']),
  },
  methods:{
    ...mapMutations(['setuserInfo']),
    clickli:function(e){
        const ind = e.currentTarget.id;
        if(ind ==1){
            this.$router.push({ path: '/scan'})
        }else if(ind == 2){
            console.log("bbb")
        }else if(ind == 3){
          //三种跳转方式
          // 字符串
            // this.$router.push('/manage')
          // 对象
          this.$router.push({ path: '/manage'})
          // 命名的路由   (有待研究)
          // this.$router.push({ name: '/home/manage', params: {}})
        }else if(ind == 4){
              this.$router.push({ path: '/ticket'})
        }
    }
  },
  created:function(){
    this.userdata = this.userInfo;
  }
};
</script>

<style lang="less">
.menu {
  .menu_top {
    width: 100%;
    height: 80%;
    background: red;
    & > .eaves {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 111px;
    }
    & > .info {
      height: 133px;
      padding-top: 134px;
      padding-left: 39px;
      padding-right: 39px;
      background: #fc5e2d;
      & > .avatar {
        width: 100px;
        height: 100px;
        float: left;
        border-radius: 50%;
        margin-left: 31px;
      }
      & > .username {
        width: 50%;
        height: 100px;
        float: left;
        text-align: left;
        margin-left: 30px;
        color: #fff;
        font-size: 36px;
        & > .u_heat,
        .u_name {
          width: 100%;
          height: 50px;
          padding: 0;
          margin: 0;
          line-height: 50px;
          font-size: 26px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      & > .news {
        width: 56px;
        height: 38px;
        float: right;
        margin-top: 31px;
      }
    }
  }
  .menu_content {
    & > .conul {
      padding: 0;
      margin: 0;
      margin-top: 50px;
      padding: 0 31.5px;
      float: left;
      & > .conli {
        width: 322px;
        height: 322px;
        padding: 0;
        margin: 0;
        float: left;
        list-style: none;
        background: rgba(255, 255, 255, 1);
        border-radius: 30px;
        box-shadow: 0px 0px 14px rgba(36, 36, 36, 0.28);
        img {
          width: 160px;
          height: 160px;
          margin-top: 40px;
        }

        & > .con_name {
          margin: 18px 0;
          font-size: 30px;
          color: #555;
        }
        & > .con_con {
          margin: 0;
          color: #b1b1b1;
          font-size: 20px;
        }
      }
      & > .conli:nth-child(1),
      .conli:nth-child(2) {
        margin-bottom: 28px;
      }
      & > .conli:nth-child(1),
      .conli:nth-child(3) {
        margin-right: 28px;
      }
    }
  }
  .menu_but {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 98px;
    border-top: 1px solid rgba(224, 224, 224, 1);
    & > .conli {
      float: left;
      display: block;
      width: 50%;
      height: 100%;
      text-decoration: none;
      text-align: center;
      line-height: 98px;
      font-size: 22px;
      color: rgba(252, 94, 45, 1);
    }
  }
}
</style>



