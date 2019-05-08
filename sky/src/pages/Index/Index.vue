<template>
    <div class="index">
        <el-container>
          <el-aside width="300px">
              <!-- 左侧导航栏 -->
              <Leftnav></Leftnav>
          </el-aside>  
              
            <el-container>
                <!--右侧头部  -->
                <el-header>
                   <Rightheader ref="rightheader"></Rightheader>
                </el-header>
                 <!--中间主体  -->
                <el-main>
                    <p>
                        <!-- 路由出口 -->
                       <router-view @updateAvatar="upAvatar"></router-view>
                    </p>
                </el-main>
                <!--右侧尾部  -->
                <el-footer>
                    <Rightfooter></Rightfooter>
                </el-footer>
                
            </el-container>
       </el-container>

         
    </div>
</template>
<script>
//引入组件
import Leftnav from '@/components/Leftnav/Leftnav.vue'
import Rightheader from '@/components/Rightheader/Rightheader.vue'
import Rightfooter from '@/components/Rightfooter/Rightfooter.vue'

export default {
    components:{//注册组件
        Leftnav,
        Rightheader,
        Rightfooter
    },
     methods: {
        upAvatar () {
            // 调用header组件方法
            this.$refs.rightheader.getAccountNameAndAvatar();
        }
    }
}
</script>
<style lang="less">
    @import url('./Index.less');
</style>