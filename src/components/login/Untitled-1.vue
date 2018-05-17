<template>
	<div class="ticket">
		用户ID(user_id):<input type="text" v-model="id">
		票券面值id:<input type="text" v-model="value">
		<button @click="stop"> {{isgo?'暂停':'开始'}}</button>
	</div>
</template>
<script>
export default {
  name: "Dish",
  data() {
    return {
      id: "",
      value: "",
      isgo: false
    };
  },
  methods: {
    start: function() {
      let that = this;
      let arr = this.value.split(",");
      that.$axios.get("/api/user/get/" + this.id).then(res => {
        if (res.data.code == 0) {
          let data = res.data.data;
          let ind = Math.floor(Math.random() * arr.length - 1);
          let id = arr[ind];
          let _parms = {
              userId: data.id,
              userName: data.userName,
              skuId: id,
              skuNum: "1",
              payType: "1"
            },
            _value = "";
          for (var key in _parms) {
            _value += key + "=" + _parms[key] + "&";
          }
          _value = _value.substring(0, _value.length - 1);

          that.$axios.get("/api/so/create？" + _value).then(res => {
            if (res.data.code == 0) {
              let num = Math.floor(Math.random() * 10);
              num = num * 1000;
              setTimeout(function() {
                that.start();
              }, num);
            }
          });
        }
      });
    },
    stop: function() {
      this.isgo = !this.isgo;
      if (this.isgo) {
        this.start();
      }
    }
  }
};
</script>