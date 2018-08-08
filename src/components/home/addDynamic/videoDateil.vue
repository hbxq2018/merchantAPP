<template>
    <div class="videoDate">
        <mt-header fixed title="视频详情">
            <router-link :to="{path:'/home',query:{ind:3}}" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="content">

            <div class="con_top">
                <img class="avatar" :src="userInfo.logoUrl" alt="店铺头像">
                <p>{{userInfo.shopName}}</p>
                <p>{{VideoData.interval}}</p>
                <img class="del" :src="delImg" alt="删除" @click="handdel">
            </div>

            <div class="cont_con">
                <p class="con_title">{{VideoData.title | uncodeUtf16}}</p>
                <div class="vidoebox">
                    <video class="videoUrl" autoplay loop controls v-if="videoUrl">
                        <source :src="videoUrl" type="video/mp4">
                        <source :src="videoUrl" type="video/ogg">
                        您的浏览器不支持 video 标签。
                    </video>
                </div>
                
                <div class="tnumber">
                    <span> <img src="../../../../static/images/tuoyuan_w.png" alt="浏览量">{{VideoData.hitNum}} </span>
                    <span>{{VideoData.zan}}
                        <img v-if="VideoData.zan" src="../../../../static/images/home_zaned.png" alt="点赞数">
                        <img v-else src="../../../../static/images/home_zan.png" alt="点赞数">
                    </span>
                </div>
            </div>

           <div class="line_02"><span>评论</span></div>

            <div class="comment" v-for="(item,index) in comList" :key="index">
                <div class="com_left">
                    <img :src="item.userPic" alt="用户头像">
                </div>
                <div class="com_right">
                    <p class="comname"> <span>{{item.nickName?item.nickName:item.userName}}</span>
                    <span>{{item.zan}}
                        <img v-if="item.zan" src="../../../../static/images/home_zaned.png" alt="点赞数">
                        <img v-else src="../../../../static/images/home_zan.png" alt="点赞数">
                    </span></p>
                    <div class="com_content">{{item.content}}</div>
                    <p class="comdate">{{item.createTime}}</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";
import {MessageBox} from "mint-ui";
export default {
    name:'videdate',
    data(){
        return{
            artId:'',
            VideoData:{},
            comList:[],
            videoUrl:'',
            delImg: require("../../../../static/images/more.png"),
        }
    },
    store,
    filters: {
        uncodeUtf16:function(str) {  //反解开EMOJI编码后的字符串   与上对应使用
        var reg = /\&#.*?;/g;
        var result = str.replace(reg, function (char) {
            var H, L, code;
            if (char.length == 9) {
            code = parseInt(char.match(/[0-9]+/g));
            H = Math.floor((code - 0x10000) / 0x400) + 0xD800;
            L = (code - 0x10000) % 0x400 + 0xDC00;
            return unescape("%u" + H.toString(16) + "%u" + L.toString(16));
            } else {
            return char;
            }
        });
        return result;
        }
    },
    computed: {
        ...mapState(["shopInfo","userInfo"])
    },
    methods:{
        //获取视频数据
        getdata: function() {
            let _parms = {
                id: this.artId,
                zanUserId: this.shopInfo.id,
                zanUserName: this.shopInfo.userName,
                zanSourceType: 1
                },
                _value = "",
                reg = /^1[34578][0-9]{9}$/;
            for (var key in _parms) {
                _value += key + "=" + _parms[key] + "&";
            }
            _value = _value.substring(0, _value.length - 1);
            this.$axios.get("/api/app/topic/getTopicByZan?" + _value).then(res => {
                if (res.data.code == 0) {
                let _Data = res.data.data;
                _Data.content = JSON.parse(_Data.content);
                _Data.interval = this.timeDiffrence(
                _Data.createTime,
                _Data.updateTime
              );
                if (_Data.nickName && reg.test(_Data.nickName)) {
                    _Data.nickName =
                    _Data.nickName.substr(0, 3) + "****" + _Data.nickName.substr(7);
                }
                if (_Data.userName && reg.test(_Data.userName)) {
                    _Data.userName =
                    _Data.userName.substr(0, 3) + "****" + _Data.userName.substr(7);
                }
                this.videoUrl = _Data.content[0].value;
                this.VideoData = _Data;
                console.log('VideoData:',this.VideoData)
                }
            });
        },
        //获取评论数据
        getcomdata:function(){
            let _parms = {
                zanUserId: this.shopInfo.id,
                refId: this.artId,
                cmtType: '2',
                },
                _value = "",
                reg = /^1[34578][0-9]{9}$/;
            for (var key in _parms) {
                _value += key + "=" + _parms[key] + "&";
            }
            _value = _value.substring(0, _value.length - 1);
            this.$axios.get("/api/app/cmt/list?" + _value).then(res => {
                if (res.data.code == 0) {
                let _Data = res.data.data.list;
                for(let i in _Data){
                    if (_Data[i].nickName && reg.test(_Data[i].nickName)) {
                        _Data[i].nickName =
                        _Data[i].nickName.substr(0, 3) + "****" + _Data[i].nickName.substr(7);
                    }
                    if (_Data[i].userName && reg.test(_Data[i].userName)) {
                        _Data[i].userName =
                        _Data[i].userName.substr(0, 3) + "****" + _Data[i].userName.substr(7);
                    }
                    let arr = _Data[i].createTime.split(" ");
                    _Data[i].createTime =arr[0];
                }
                this.comList = _Data;
                }
            });
        },
        //文章发布时间 
        timeDiffrence: function(current, updateTime, createTime) {
            let createT = "",
                timestamp = 0,
                str = "暂无";
            updateTime = updateTime ? updateTime.replace(/-/g, "/") : "";
            updateTime = updateTime ? updateTime : createTime;
            if (updateTime != null && updateTime != "") {
                createT = new Date(updateTime).getTime();
                current = new Date().getTime();
                timestamp = (+current - createT) / 1000;
                if (timestamp / 31536000 > 1 || timestamp / 31536000 == 1) {
                str = Math.floor(timestamp / 60 / 60 / 24 / 365) + "年前";
                } else if (timestamp / 2592000 > 1 || timestamp / 2592000 == 1) {
                str = Math.floor(timestamp / 60 / 60 / 24 / 30) + "个月前";
                } else if (timestamp / 86400 > 1 || timestamp / 86400 == 1) {
                str = Math.floor(timestamp / 60 / 60 / 24) + "天前";
                } else if (timestamp / 3600 > 1 || timestamp / 3600 == 1) {
                str =
                    Math.floor(timestamp / 60 / 60) +
                    "小时" +
                    Math.floor((timestamp % 3600) / 60) +
                    "分钟前";
                } else if (timestamp / 60 > 1 || timestamp / 60 == 1) {
                str = Math.floor(timestamp / 60) + "分钟前";
                } else {
                str = "刚刚发布";
                }
            }
            return str;
        },
        //点击删除
        handdel:function(){
            MessageBox.confirm("是否确认删除？").then(action => {
            if (action == "confirm") {
                this.$axios.get("/api/app/topic/delete/" + this.artId).then(res => {
                    if (res.data.code == 0) {
                        history.go(-1)//回退到上一页面
                        Toast("删除成功！");
                    }
                });
                }
            });
        }
    },
    created:function(){
       if (this.$route.params.id) {
            this.artId = this.$route.params.id;
            this.getdata();
            this.getcomdata();
        }
    }
}
</script>

<style lang="less">
    .videoDate{
        .content{
            width: 694px;
            word-break:break-all;
            padding: 0 28px 60px 28px;
            // padding-top: 90px;
            overflow:scroll;
            .con_top{
                width: 100%;
                height: 74px;
                padding: 24px 0;
                position: relative;
                .avatar{
                    width: 74px;
                    height: 74px;
                    border-radius: 50%;
                    float: left;
                    margin-right: 18px;
                }
                &>p{
                    float: left;
                    width: 550px;
                    text-align: left;
                    line-height: 37px;
                    height: 37px;
                }
                &>p:nth-child(1){
                    color: RGBA(25, 25, 25, 1);
                    font-size: 30px;
                }
                &>p:nth-child(2){
                    color: RGBA(177, 177, 177, 1);
                    font-size: 24px;
                }
                .del{
                    position: relative;
                    top: -74px;
                    right: -270px;
                    width: 74px;
                    height: 74px;
                    transform:rotate(90deg);
                }
            }
            .cont_con{
                width: 100%;
               
                .con_title{
                    color: RGBA(25, 25, 25, 1);
                    font-size: 34px;
                }
                .vidoebox{
                    background: #000;
                    height: 390px;
                    width: 694px;
                    margin: 37px 0;
                }
                .videoUrl{ 
                    height: 390px;
                    width: auto;
                }
                .tnumber{
                    width: 100%;
                    height: 30px;
                    margin-bottom: 30px;
                    span{
                        img{
                            width: 28px;
                            height:25px;
                        }
                    }
                    &>span:nth-child(1){
                        float: left;
                        img{
                            margin-right: 9px;
                        }
                    }
                    &>span:nth-child(2){
                        float: right;
                        img{
                            margin-left: 9px;
                        }
                    }
                }
            }
            
            .line_02 {
                height: 1px;
                border-top: 1px solid #ddd;
                text-align: center;
                margin: 36px 0;
                span {
                    position: relative;
                    top: -14px;
                    background: #fff;
                    padding: 0 20px;
                }
            }
            .comment{
                width: 100%;
                height: 190px;
                margin-top: 25px;
                padding-bottom:25px; 
                .com_left{
                    width: 54px;
                    height: 100%;
                    float: left;
                    margin-right: 20px;
                    &>img{
                        width: 54px;
                        height: 54px;
                        border-radius: 50%;
                        
                    }

                }
                .com_right{
                    float: left;
                    width: 620px;
                    text-align: left;
                    border-bottom: 1px solid rgba(224,224,224,1);
                    .comname{
                        height: 34px;
                        line-height: 34px;
                        padding: 10px 0;
                        color: RGBA(128, 128, 128, 1);
                        font-size: 28px;
                        span:nth-child(2){
                            float: right;
                            img{
                                width: 34px;
                                height: 34px;
                                margin-left: 15px;
                            }
                        }
                    }
                    .comdate{
                        text-align: left;
                        padding: 24px 0;
                        color: RGBA(177, 177, 177, 1);
                        font-size: 24px;
                    }
                    .com_content{
                        height: 65px;
                        color: RGBA(25, 25, 25, 1);
                        font-size: 24px;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        display:-webkit-box;
                        -webkit-box-orient:vertical;
                        -webkit-line-clamp:2;
                    }
                }
            }
            .comment:last-child{
                padding-bottom:150px; 
            }
        }
    }
</style>



