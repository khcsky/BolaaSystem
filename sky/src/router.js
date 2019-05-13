

import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({


  routes: [
    {
      path: '/',
      redirect: '/login' // 路由重定向
    },
    { //登录
      path: '/login',
      name: 'login',
      component: () => import('./pages/Login/Login')
    },
    { //项目主页
      path: '/index',
      component: () => import('./pages/Index/Index'),
      children:[{ //默认显示项目
        path: '',
        name: '',
        component: () => import('./pages/Projectentity/Projectentity')
      },
      { //项目行业
        path: '/index/projectindustry',
        name: 'projectindustry',
        component: () => import('./pages/Projectindustry/Projectindustry')
      },
      { //板块采集
        path: '/index/plateclassification',
        name: 'plateclassification',
        component: () => import('./pages/Plateclassification/Plateclassification')
      },
      { //板块分类
        path: '/index/platecollect',
        name: 'platecollect',
        component: () => import('./pages/Platecollect/Platecollect')
      },
      { //客户
        path: '/index/client',
        name: 'client',
        component: () => import('./pages/Client/Client')
      },
      { //插件
        path: '/index/plugin',
        name: 'plugin',
        component: () => import('./pages/Plugin/Plugin')
      },
      { //密码修改
        path: '/index/passwordmodfiy',
            name: 'passwordmodfiy',
            component: () => import('./pages/Passwordmodfiy/Passwordmodfiy')
      },
      { //个人中心
        path: '/index/personal',
            name: 'personal',
            component: () => import('./pages/Personal/Personal')
      }],
    },
    
   
    
  ]
})
