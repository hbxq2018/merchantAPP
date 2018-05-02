import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state={
    shopId:'',
    userInfo:{},
    count:1,
    phone:133000011111
}

const mutations={
    setuserInfo(state,data){
        state.userInfo = data;
        console.log('state:',state)
    },
    add(state){
        state.count++;
    },
    reduce(state){
        state.count--;
    },
    setphone(state,phone){
        state.phone = phone
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
