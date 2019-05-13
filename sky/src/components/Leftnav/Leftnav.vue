<template>
    <div class="left-nav">
             
            <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            router>
            <h5>BOLAA后台管理系统</h5>
               <el-submenu v-for="(menu, index) in menuData" :key="index" :index="(index + 1) + ''">
                <template slot="title">
                    <span class="icon iconfont" v-html="menu.icon_code"></span>
                    <span>{{ menu.menuTitle }}</span>
                </template>
                <el-menu-item :index="subMenu.path" v-for="(subMenu, index) in menu.children" :key="index">
                    {{ subMenu.subMenuTitle }}
                </el-menu-item>
            </el-submenu>
          
            </el-menu>

    </div>
</template>
<script>
export default {
    data(){
        return{
            //导航列表数据
            menuData:[
                //项目表实体
                {
                    menuTitle:'项目',
                    icon_code:'&#xe641',
                    children: [
                        {
                            path: '/index',
                            subMenuTitle: '项目管理'
                        },
                        {
                            path: '/index/projectindustry',
                            subMenuTitle: '行业管理'
                        }
                    ]
                },
                //客户表实体
                {
                    menuTitle:'客户',
                    icon_code:'&#xe62c',
                    children: [
                        {
                            path: '/index/client',
                            subMenuTitle: '客户管理'
                        }
                    ]
                },
                //插件表实体
                {
                    menuTitle:'插件',
                    icon_code:'&#xe63a',
                    children: [
                        {
                            path: '/index/plugin',
                            subMenuTitle: '插件管理'
                        }
                    ]
                },

                //板块部分
                {
                    menuTitle:'板块',
                    icon_code:'&#xe60b',
                    children: [
                        {
                            path: '/index/plateclassification',
                            subMenuTitle: '采集管理'
                        },
                        {
                            path: '/index/platecollect',
                            subMenuTitle: '分类管理'
                        }
                    ]
                },
                
            ]
        }
    }
       
    
}
</script>
<style lang="less">
   @import url('./leftnav.less');
</style>