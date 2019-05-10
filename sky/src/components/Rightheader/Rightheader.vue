
<template>
  <div class="right-header">
    <el-row :gutter="20">
      <el-col :span="18">
        <i class="el-icon-menu"></i>
        <span class="title">欢迎来到BOLAA后台管理系统</span>
      </el-col>
      <el-col :span="6">
        <el-row>
          <el-col :span="8">
            <!-- 头像 -->
                        <div class="avatar">
                            <router-link to='/index/personal'>
                                <img :src="avatarurl" alt="">
                            </router-link>
                        </div>
          </el-col>
          <el-col :span="16">
            <div class="drop-down">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ accountName }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                  <el-dropdown-item command="passwordmodfiy">密码修改</el-dropdown-item>
                  <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import av from '../../assets/imgs/defavatar.jpg'
export default {
  data() {
    return {
      accountName: "默认值",
       avatarurl: av
    };
  },
  methods: {
    // 点击下拉菜单选项触发函数
    handleCommand(command) {
      if (command === "logout") {
        //清除token
        window.localStorage.removeItem("token"),
          // 弹出提示
          this.$message({
            type: "success",
            message: "退出成功，欢迎回来"
          });
        setTimeout(() => {
          this.$router.push("/login");
        }, 1000);
      } else if (command === 'personal') {
            // 跳转到个人中心
            this.$router.push('/index/personal');
        }
         else if (command === 'passwordmodfiy') {
            // 跳转到个人中心
            this.$router.push('/index/passwordmodfiy');
        }
    },

  //  // 获取账号名和头像
  //     getAccountNameAndAvatar() {
        
  //       // 调用了函数
  //       // 发送请求 获取账号名字
  //       this.req.get('/account/accountnameandavatar')
  //           .then(res => {
  //               // 接收后端返回的数据
  //               let { account, avatarurl } = res;
  //               // 赋值给对应的变量
  //               this.accountName = account;
  //               this.avatarurl = `http://127.0.0.1:5777/${avatarurl}`;
  //           })
  //           .catch(err => {
  //               console.log(err)
  //           })
  //     }
  },
  
  // created() {
  //    this.getAccountNameAndAvatar() // 调用获取账号名和头像的函数
  // },
};
</script>
<style lang="less">
@import "./Rightheder.less";
</style>