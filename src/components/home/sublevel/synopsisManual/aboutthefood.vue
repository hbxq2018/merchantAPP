<template>
    <div class="aboutFood">
        <mt-header :title="title" fixed><router-link slot="left" :to="goback">
        <mt-button icon="back"></mt-button></router-link></mt-header>

        <div class="about">
            <img :src="img2" alt="">
        </div>
    </div>
</template>

<script>
export default {
    name:'aboutFood',
    data () {
        return {
            title:'关于享7美食',
            goback:{path:'serviceManual'},
            img1:'https://xq-1256079679.file.myqcloud.com/test_关于abc_0.8.jpg',
            img2:''
        }
    },
    created(){
        if (this.$route.params.acturl) {
            this.img2 = this.$route.params.acturl;
            this.title = '活动详情';
            this.goback={path:'actdetails'};
        }else{
            this.img2=this.img1;
        }
    }
}
</script>

<style lang="less">
    .about{
        width: 100%;
        height: 100%;
        padding-top: 80px;
        img{
            width: 100%;
            height: 100;
        }
    }
</style>


