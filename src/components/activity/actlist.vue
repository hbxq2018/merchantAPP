<template>
    <div class="actlist">
        <mt-header fixed title="活动列表" class="actlist">
            <router-link to="/home" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div class="listtab">
            <div class="tableft" @click="clickall"><div :class="isall?'con selected':'con'">全部</div></div>
            <div class="tabright" @click="clickthen"><div :class="isall?'con':'con selected'">已报</div></div>
        </div>
        <ul class="actul">
            <li class="actli" v-for="(item,index) in imgs" :key="index" @click="clickli(index)">
                <img :src="item.img" alt="活动图片">
                <div class="libottom">
                    <p>
                        <span>十堰“100（百）菜”评选暨《十堰食典》</span>
                        <span :class="isall?'allspan':'thenspan'">{{isall?'去报名':'已报名'}}</span>
                    </p>
                    <p>
                        <span>报名截止日期：2018.05.05</span>
                        <span>参与人数：41255人</span>
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name:'actlist',
    data(){
        return{
            isall:true,
            imgs:[{
                img:'https://xq-1256079679.file.myqcloud.com/test_560211713524426866_0.8.jpg'
            },
            {
                img:'https://xq-1256079679.file.myqcloud.com/test_560211713524426866_0.8.jpg'
            },
            {
                img:'https://xq-1256079679.file.myqcloud.com/test_560211713524426866_0.8.jpg'
            }]
            
        }
    },
    methods:{
        clickall:function(){
            this.isall = true;
        },
        clickthen:function(){
            this.isall = false;
        },
        clickli:function(val){
            this.$router.push({ name: "Actdetails", params: {id:val} });
        }
    },
    created:function(){
        this.isall = true;
    }
}
</script>
<style lang="less">
    .actlist{
        .listtab{
            margin-top: 80px;
            position: fixed;
            width: 100%;
            height: 80px;
            background: #fff;
            .tableft,.tabright{
                width: 50%;
                height: 100%;
                line-height: 80px;
                line-break: 80px;
                text-align: center;
                cursor:pointer;
                .con{
                    height: 76px;
                    width: 80px;
                    text-align: center;
                    margin-left: 40%;
                    color: #B1B1B1;
                    font-size: 34px;
                }
                .selected{
                    color: #191919;
                    border-bottom: 4px solid #FC5E2D;
                }
            }
            .tableft{
                float: left;
            }
            .tabright{
                float: right;
            }
            
        }
        .actul{
            width: 100%;
            margin: 0;
            padding: 0;
            padding-top: 160px;
            background: #EBEBEB;
            .actli{
                width: 100%;
                height: 520px;
                list-style: none;
                margin-bottom: 20px;
                background: #fff;
                &>img{
                    width: 100%;
                    height: 420px;
                }
                .libottom{
                    width: 100%;
                    height: 100px;
                    &>p{
                        width: 100%;
                        height: 50px;
                        line-height: 50px;
                        &>span{
                            color: #B1B1B1;
                            font-size: 22px;
                        }
                        &>span:nth-child(1){
                            float: left;
                            margin-left: 30px;
                        }
                        &>span:nth-child(2){
                            float: right;
                            margin-right: 20px;
                        }
                    } 
                    &>p:nth-child(1){
                        &>span:nth-child(1){
                            color: #191919;
                            font-size: 26px;
                        }
                        &>span:nth-child(2){
                            height: 35px;
                            border-radius: 20px;
                            line-height: 35px;
                            margin-top: 10px;
                            padding: 0 10px;
                        }
                        .allspan{
                            border: 1px solid #35C85F;
                            color: #35C85F;
                        }
                        .thenspan{
                            border: 1px solid #FC5E2D;
                            color:#FC5E2D;
                        }
                    }

                }
            }
        }
    }
</style>



