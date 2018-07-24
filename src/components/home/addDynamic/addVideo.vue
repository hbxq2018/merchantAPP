<template>
    <div class="addVideo">
        <mt-header fixed :title="title">
            <mt-button slot="left" icon="back" @click="handback">返回</mt-button>
            <mt-button slot="right" @click="handsend">发送</mt-button>
        </mt-header>
        <div class="content">
            <div class="cover">
                <div class="uploadvideo" v-if="!coverImg">
                    <p v-if="motype==2 && !coverImg" class="p1">上传视频</p>
                    <p v-if="motype==2 && !coverImg" class="p2">（上传抖音、快手、微视等原创视频效果更好）</p>
                    <p v-if="motype==1 && !coverImg" class="p3">+设置封面</p>
                </div>
                <img class="delImg" v-if="coverImg" @click="handdel" src="../../../../static/images/del.png" alt="删除">
                <img class="uploadImg" v-if="coverImg && !isplay" :src="coverImg" alt="封面图片">
                <video class="uploadImg" v-if="isplay && coverUrl" autoplay controls>
                    <source :src="coverUrl" type="video/mp4">
                    <source :src="coverUrl" type="video/ogg">
                    您的浏览器不支持 video 标签。
                </video>
                <div v-if="motype==2 && coverUrl && !isplay" class="moModal" @click="handplay">
                    <img class="playIcon" :src="playIcon" alt="播放图标">
                </div>
                <input class="getfile" v-if="!coverUrl" type="file" ref="mocover" @change="getFile">
            </div> 
            <input class="moTitle" type="text" placeholder="标题" v-model="moTitle">
            <hr>
            
            <div id="article-body" v-if="motype==1">
              
            </div>

        </div>
        <video src="" id="videoId" style="width:0;height:0"></video>
    </div>
</template>

<script>

import Vue from "vue";
import { MessageBox, Indicator, Toast } from "mint-ui";
import store from "@/vuex/store";
import { mapState, mapMutations } from "vuex";

export default {
  name: "addVideo",
  data() {
    return {
      motype: 2,
      duration:0,
      title: "",
      content: "",
      moTitle: "",
      coverImg: "",
      coverUrl: "",
      isplay: false,
      playIcon: "https://xq-1256079679.file.myqcloud.com/test_play_0.8.jpg"
    };
  },
  store,
  mounted:function(){
    this.videoId = $('#videoId');
    let article = $('#article-body');
		if(article){
		  var artEditor = new Eleditor({
        el: '#article-body',
        toolbars: [
          'insertText',
          'editText',
          'insertImage',
          'insertHr',
          'delete',
          'undo',
          'cancel'
        ],
        upload:{
          server: "/api/app/img/upload",
          fileSizeLimit: 10,
          formName: 'file',
          options :{formData:{userName:this.shopInfo.userName}},
          fromData:{'userName':this.shopInfo.userName}
        },
        changer: function(){
          this.content=$('#article-body').html();
        }
      });
		}
  },
  computed: {
    ...mapState(["shopInfo"])
  },
  methods: {
    //返回
    handback:function(){
      if(this.moTitle || this.content || this.coverImg){
        MessageBox.confirm("有正在编辑的文稿示未发送保存，现在退出将清空文稿，是否确认退出？").then(
          action=>{
            if(action == 'confirm'){
              this.$router.push({ path: "/home", query: { ind: 3 } });
            }
          }
        )
      }else{
        this.$router.push({ path: "/home", query: { ind: 3 } });
      }
      
    },
    //清空数据
    EmptyData:function(){
      if($('#article-body').html()){
        $('#article-body').html('<p class="Eleditor-placeholder">点击此处编辑内容</p>');
      }
      this.duration=0,
      this.title= "",
      this.content= "",
      this.moTitle= "",
      this.coverImg= "",
      this.coverUrl= "",
      this.isplay= false
    },
    //点击发送，保存编辑
    handsend: function() {
      let _this = this;
      if($('#article-body').html()){
        this.content=$('#article-body').html();
      }
      if(this.content.length>4800){
        Toast("文字内容过长，可用图片代替");
      }else if (!this.moTitle) {
        Toast("请输入标题");
      } else if (!this.coverImg) {
        Toast("请上传封面图片或视频");
      } else if(this.duration>30 && this.motype==2){
        Toast("视频播放时长不超过30秒");
          this.coverImg='';
          this.content='';
      } else if(!this.content && this.motype==1){
        Toast("请输入文章内容");
        this.content='';
      }else{
       this.moTitle=this.utf16toEntities(this.moTitle);
       this.content=this.utf16toEntities(this.content);
        
        MessageBox.confirm("确定保存?").then(
          action => {
            if (action == "confirm") {
              let _parms = {
                title: this.moTitle,
                content: this.content,
                topicType: this.motype,
                userId: this.shopInfo.id,
                summary: this.moTitle,
                homePic: this.coverImg,
                userName: this.shopInfo.userName,
                nickName: this.shopInfo.nickName
              }
              $.post("/api//app/topic/add",_parms,function(res){
                if (res.code == 0) {
                  _this.EmptyData();
                  MessageBox("提示", "保存成功");
                }
              })
            }
          },
          () => {}
        );
      }
    },
    //播放视频
    handplay: function() {
      //视频
      if (this.motype == 2) {
        this.isplay = true;
      } else {
        Toast("没有可播放的视频，请重新上传视频");
      }
    },
    //删除封面
    handdel: function() {
      this.coverImg = "";
      this.coverUrl = "";
      this.isplay = false;
      if (this.motype == 2) {
        this.content = "";
      }
    },
    //上传图片视频
    getFile: function(e) {
      let _text = "",
        _Url = "";
        // 1-文章  2-视频
      if (this.motype == 1) {
        _text = "图片上传中...";
        _Url = "/api/app/img/upload";
      } else if (this.motype == 2) {
        _text = "视频上传中...";
        _Url = "/api/app/img/uploadMp4";
      }
      
      let _this = this,
        inputDOM = {};
      inputDOM = this.$refs.mocover;
      // 通过DOM取文件数据
      console.log("inputDOM:", inputDOM);
      this.file = inputDOM.files[0];
      this.errText = "";
      
      if (!this.file) {
        return false;
      }
      Indicator.open({
        text: _text,
        spinnerType: "triple-bounce"
      });
      // 触发这个组件对象的input事件
      this.$emit("input", this.file);
      // 这里就可以获取到文件的名字了
      this.getFileURL(this.file)
      this.fileName = this.file.name;
      // 这里加个回调也是可以的
      this.onChange && this.onChange(this.file, inputDOM.value);
      // this.imgPreview(this.file);
      let form = new FormData();
      form.append("file", this.file, this.file.name);
      form.append("userName", this.shopInfo.userName);
      this.$axios
        .post(_Url, form)
        .then(res => {
          Indicator.close();
          if (res.data.code != 0) {
            Toast("系统繁忙请稍后再试");
            return false;
          }
          if (this.motype == 1) {
            //文章
            _this.coverImg = res.data.data.picUrl;
          } else if (this.motype == 2) {
            //视频
            _this.coverImg = res.data.data.smallPicUrl;
            _this.coverUrl = res.data.data.picUrl;
            let _obj = {
              type:'video',
              value:res.data.data.picUrl,
              txt:''
            },arr=[],value='';
            arr.push(_obj);
            value = encodeURIComponent(JSON.stringify(arr));
            _this.content = value;
          }
        })
    },
    //获取视频时长
    getFileURL(file) {
      //获取视频本地地址
      var getUrl = null;
      if (window.createObjectURL != undefined) { // basic
        getUrl = window.createObjectURL(file);
      } else if (window.URL != undefined) { // mozilla(firefox)
        getUrl = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) { // webkit or chrome
        getUrl = window.webkitURL.createObjectURL(file);
      }
      
      if (getUrl) {
        videoId.src = getUrl;
          setTimeout(function(){
           //获取视频时长
            this.duration = videoId.duration;
          },1000)
      }
    },
    //将emoji表情转为字符进行存储 
    utf16toEntities:function(str) {  
      var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则 
      str = str.replace(patt, function (char) {
        var H, L, code;
        if (char.length === 2) {
          H = char.charCodeAt(0); // 取出高位 
          L = char.charCodeAt(1); // 取出低位 
          code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法 
          return "&#" + code + ";";
        } else {
          return char;
        }
      });
      return str;
    }
  },
  created() {
    this.EmptyData();
    
    if (this.$route.params._type == 1) {
      this.motype = 1;
      this.title = "编辑文章";
    } else if (this.$route.params._type == 2) {
      this.motype = 2;
      this.title = "编辑视频";
    }
  }
};
</script>

<style lang="less">
.addVideo {
  #article-body{
    width: 100%;
    padding:  5px;
    overflow:scroll;
    border: 1px solid #7e6e6e;
    padding-bottom: 500px;
  }
  .content {
    width: 694px;
    padding: 28px;
    padding-top: 100px;
    word-break:break-all;
    overflow:scroll;
    .cover {
      width: 694px;
      height: 390px;
      border-radius: 8px;
      border-style: dotted;
      position: relative;
      .getfile {
        width: 100%;
        height: 390px;
        box-sizing: border-box;
        background: #fff;
        opacity: 0;
        position: absolute;
        left: -0px;
        top: -0px;
        z-index: 100;
      }
      .delImg {
        position: absolute;
        width: 50px;
        height: 50px;
        top: 0;
        right: 20px;
        z-index: 102;
      }
      .uploadImg,
      .moModal {
        width: 694px;
        height: 390px;
        position: absolute;
        left: 0;
        top: 0;
      }
      .moModal {
        border-radius: 8%;
        background: rgba(25, 25, 25, 1);
        opacity: 0.5;
        border-radius: 8px;
        z-index: 1;
        .playIcon {
          position: relative;
          widows: 80px;
          height: 80px;
          border-radius: 50%;
          top: 155px;
          z-index: 1;
        }
      }
      .uploadvideo {
        width: 100%;
        margin-top: 200px;
        position: relative;
        overflow: hidden;

        .p1,
        .p3 {
          color: RGBA(128, 128, 128, 1);
          font-size: 36px;
        }
        .p2 {
          color: RGBA(177, 177, 177, 1);
          font-size: 24px;
        }
      }
    }
    .moTitle {
      width: 100%;
      border: none;
      font-size: 42px;
      margin: 30px 0;
      text-align: center;
    }
    .moArea {
      margin-top: 32px;
      width: 100%;
      border: none;
      font-size: 36px;
    }
  }
  .ql-snow.ql-toolbar button, .ql-snow .ql-toolbar button{
    width:40px!important;
    height:40px!important;
  }
  .ql-toolbar.ql-snow + .ql-container.ql-snow{
    font-size: 40px!important;
  }
}
</style>


