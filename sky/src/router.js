

import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)
const router = new Router({
  routes: [
    { // 登录
      path: '/login',
      name: 'login',
      component: () => import('./pages/Login/Login')
    },
    { //项目主页
      path: '/',
      name: "Home",
      alias: '/index',
      component: () => import('./pages/Index/Index'),
      children:[{ //默认显示项目
        path: '',
        name: '',
        component: () => import('./pages/Projectentity/Projectentity'),
        meta: { auth: true }
      },
      { // 项目行业
        path: '/index/projectindustry',
        name: 'projectindustry',
        component: () => import('./pages/Projectindustry/Projectindustry'),
        meta: { auth: true }
      },
      { // 板块采集
        path: '/index/plateclassification',
        name: 'plateclassification',
        component: () => import('./pages/Plateclassification/Plateclassification'),
        meta: { auth: true }
      },
      { // 板块分类
        path: '/index/platecollect',
        name: 'platecollect',
        component: () => import('./pages/Platecollect/Platecollect'),
        meta: { auth: true }
      },
      { //客户
        path: '/index/client',
        name: 'client',
        component: () => import('./pages/Client/Client'),
        meta: { auth: true }
      },
      { // 插件
        path: '/index/plugin',
        name: 'plugin',
        component: () => import('./pages/Plugin/Plugin'),
        meta: { auth: true }
      },
      { // 密码修改
        path: '/index/passwordmodfiy',
        name: 'passwordmodfiy',
        component: () => import('./pages/Passwordmodfiy/Passwordmodfiy'),
        meta: { auth: true }
      },
      { // 个人中心
        path: '/index/personal',
        name: 'personal',
        component: () => import('./pages/Personal/Personal'),
        meta: { auth: true }
      },
      {
          path: '*',
          redirect: '/'
      }
      ],
    },
  ]
})

//全局前置守卫
// router.beforeEach((to,from,next) => {
//   // 获取仓库里的登录信息
//   const app = router.app ;
//   const store = app.$options.store ;
//   const auth = store && store.state.auth ;
//
//   if ((auth && to.path.indexOf("/login") !== -1) ||(!auth && to.meta.auth)) {
//     next("/");
//   } else {
//     next();
//   }
// });

export default router
