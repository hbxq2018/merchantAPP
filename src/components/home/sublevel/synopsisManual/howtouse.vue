<template>
    <div class="aboutFood">
        <mt-header title="如何使用"><router-link slot="left" :to="{path:'serviceManual'}">
        <mt-button icon="back"></mt-button></router-link></mt-header>

        <div class="about">
            <img src="https://xq-1256079679.file.myqcloud.com/test_如何使用abc_0.8.jpg" alt="">
        </div>
    </div>
</template>

<script>
export default {
    name:'aboutFood',
    data () {
        return {
            
        }
    }
}
</script>

<style lang="less">
    .about{
        width: 100%;
        height: 100%;
        img{
            width: 100%;
            height: 100;
        }
    }
</style>


