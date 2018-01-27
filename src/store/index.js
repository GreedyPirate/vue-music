import Vue from 'vue'
import Vuex from 'vuex'
//路径必须加 ./
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import creatlogger from 'vuex/dist/logger'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

console.log(mutations)
/**
 * creatlogger:在state改变前后打印
 */
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugin: debug ? [creatlogger()] : []
})
