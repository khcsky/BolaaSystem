import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/iconfont.css'
import store from './store/store'

//引入echarts报表
import echarts from 'echarts'

//引入 封装请求api
import request from'./apis/request'

//引入elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//全局使用elementui
Vue.use(ElementUI)

// 挂载在vue原型上 所有vue实例共享
Vue.prototype.echarts = echarts;
Vue.prototype.req = request;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
