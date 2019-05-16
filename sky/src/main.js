import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/iconfont.css'
import store from './store/store'
// import './mock'

//引入echarts报表
import echarts from 'echarts'

//引入 封装请求api
import request from'./apis/request'
import api from './apis'

//引入elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//全局使用elementui
Vue.use(ElementUI)

// 挂载在vue原型上 所有vue实例共享
Vue.prototype.echarts = echarts;
Vue.prototype.req = request;
Vue.prototype.$api = api;

Vue.config.productionTip = false

// 路由守卫
router.beforeEach((to, from, next) => {
// 获取浏览器token
  const token = window.localStorage.getItem('token')
// 如果没有token
  if (!token) {
// 如果去的是登录
    if (to.path === '/login') {
      next(); // 放行
    } else {
// 否则 跳转到登录
      next({path: '/login'})
    }
  } else {
    next(); // 放行
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
