import "babel-polyfill"
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store'

fastclick.attach(document.body)

Vue.config.productionTip = false
Vue.use(VueLazyload,{
  //懒加载的默认图片
  loading:require('common/image/default.png') // common可以是别名
});
console.log(store)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
