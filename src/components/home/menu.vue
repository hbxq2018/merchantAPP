<template>
  <div class="menu">
      <div class="menu_top">
           <img class="eaves" src="../../../static/images/eaves.png" alt="顶部图片">
            <div class="info">
                <img class="avatar" :src='userdata.src' alt="用户头像">
                <div class="username">
                    <p class="u_name">
                        {{userdata.name}}
                    </p>
                    <p class="u_heat">
                        人气{{userdata.heat}}
                    </p>
                </div>
                <img src="../../../static/images/news.png" alt="消息" class="news">
            </div>
      </div>
      <div class="menu_content">
          <ul class="conul">
              <li class="conli">
                  <img src="../../../static/images/scan.png" alt="扫码验证">
                  <p class="con_name">扫码验证</p>
                  <p class="con_con">核销券票</p>
              </li>
              <li class="conli">
                  <img src="../../../static/images/orders.png" alt="营业数据">
                  <p class="con_name">营业数据</p>
                  <p class="con_con">核销记录、数据统计</p>
              </li>
              <li class="conli">
                  <img src="../../../static/images/stores.png" alt="店铺管理">
                  <p class="con_name">店铺管理</p>
                  <p class="con_con">更改店铺信息、员工管理</p>
              </li>
              <li class="conli">
                  <img src="../../../static/images/voucher.png" alt="享7券">
                  <p class="con_name">享7券</p>
                  <p class="con_con">自定义满减额度</p>
              </li>
          </ul>
      </div>
  
  </div>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      msg: "menu",
      userdata: {
        src: "../../../static/images/timg (2).jpg",
        name: "恩施映像",
        heat: "1382"
      }
    };
  }
};
</script>

<style lang="less">
.menu {
  .menu_top {
    width: 100%;
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
        padding:0;
        margin:0;
        margin-top: 50px;
        padding: 0 31.5px;
        float: left;
      &>.conli{
          width: 322px;
          height: 322px;
          padding:0;
          margin:0; 
          float:left;
          list-style:none; 
          background:rgba(255,255,255,1);
          border-radius: 30px ;
          box-shadow:0px 0px 14px rgba(36,36,36,0.28);
          img{
              width: 160px;
              height: 160px;
              margin-top: 40px;
          }
          
          &>.con_name{
              margin:18px 0;
              font-size: 30px;
              color: #555;
          }
          &>.con_con{
              margin:0;
              color: #B1B1B1;
              font-size: 20px;
          }
      }
      &>.conli:nth-child(1) ,.conli:nth-child(2){
          margin-bottom: 28px;
      }
      &>.conli:nth-child(1) ,.conli:nth-child(3){
          margin-right: 28px;
      }
    }
   
  }
  .menu_but{
      position: fixed;
      left: 0;
      bottom:0;
      width: 100%;
      height: 98px;
      border-top: 1px solid rgba(224,224,224,1);
      &>a{
          display: block;
          width: 50%;
          height: 100%;
          text-decoration:none;
          float: left;
          text-align: center;
          line-height: 98px;
          font-size: 22px;
          color:rgba(252,94,45,1);
      }
  }
}
</style>



