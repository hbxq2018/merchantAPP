import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state={
    shopId: '',
    userInfo: {},  //此为商户信息
    shopInfo:{},       //此为用户信息
    newUserInfo: {}
}

const mutations={
    setuserInfo(state,data){
        if(typeof data == "string" ){
            let arr = data.split('/')
            for(let key in state.userInfo){
                if(arr[1] == key){
                    if((state.userInfo[key]+'').indexOf('/') != -1){
                        let ind = state.userInfo[key].indexOf("/");
                        let val1 = state.userInfo[key].slice(0,ind);
                        let val2 = state.userInfo[key].slice(ind+1,state.userInfo[key].length);
                        let last = arr[0].substr(arr[0].length-1,1);
                        if(last == 1){
                            val1 = '';
                            val1 = arr[0].slice(0,arr[0].length-1);
                        }else if(last ==2){
                            val2 = '';
                            val2 = arr[0].slice(0,arr[0].length-1);
                        }
                        let val = val1+'/'+val2;
                        state.userInfo[key]=val;
                    }else{
                        state.userInfo[key] = arr[0];
                    } 
                }
            }
        }else if(typeof data == "object"){
            state.userInfo = data;
        }
        // console.log('state:',state)
    },
    setshopId(state,id){
        state.shopId = id;
    },
    setNewUserInfo(state, obj) {
        state.newUserInfo = obj;
    },
    reduce(state){
        state.count--;
    },
    setphone(state,phone){
        state.phone = phone
    },
    setshopInfo(state,data){
        state.shopInfo = data
    }
}

const getters = {
    count:function(state){
        return state.count +=100;
    },
    phone:function(state){
        return state.phone;
    }
}

export default new Vuex.Store({
	state,mutations,getters
})
