import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

// 1.安装插件
Vue.use(Vuex)

const state =  {
  cartList: []
}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export default store