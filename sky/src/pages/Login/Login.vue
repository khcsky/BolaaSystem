<template>
    <div class="login">
      <div class="login-wrapper">
          <h2 class="title">
               <span class="icon iconfont">&#xe641;</span>
              <span class="title_word">欢迎来到BLaoo管理系统</span> 
          </h2>
            <!-- 登录表单 -->
           <el-form 
           :model="loginForm" 
           status-icon 
           :rules="rules" 
           ref="loginForm" 
           label-width="100px"
            class="demo-ruleForm"
            >     
                <!-- 账号 -->
                <el-form-item label="账号" prop="account">
                    <el-input type="text" v-model="loginForm.account" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>
             
                <!-- <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="loginForm.checkPass" autocomplete="off"></el-input>
                </el-form-item> -->


                <el-form-item>
                    <el-button  type="primary" @click="submitForm('ruleForm2')">登录</el-button>
                    <el-button @click="resetForm('ruleForm2')">重置</el-button>
                </el-form-item>
            </el-form>
      </div>
    </div>
</template>
<script>
export default {
    data() {
         // 自定义验证密码规则
         let validatePwd =(rule, value, callback)=>{
             if(value===''){
                  callback(new Error('请输入密码')); 
             }else if(value.length<6||value.length>12){
                 callback(new Error('长度在 6 到 12 个字符'));
             }else{
                 if(this.loginForm.checkPass !==''){
                    this.$refs.loginForm.validateField('checkPass')
                 }
                  // 成功的回调
                 callback();
             }
         }
        //  // 自定义验证确认密码函数
        //  let checkPwd = (rule, value, callback)=>{
        //      if(value===''){
        //           callback(new Error('请再次输入密码')); 
        //      }else if(value !==this.loginForm.password){//如果不等于第一次输入的密码报错
        //          callback(new Error('两次密码不一致'))
        //      }else{
        //          callback(); // 直接调用就是成功
        //      }
        //  }
      return {
        loginForm: {
          account: '',// 账号
           password: '',// 密码
          // checkPass: ''// 确认密码
          
        },
        rules: {
          // 账号验证
          account:[
               { required: true, message: '请输入账号', trigger: 'blur' }, // 非空验证
               { min: 3, max: 5, message: '长度在 4 到 16 个字符', trigger: 'blur' } // 
          ],
          // 密码验证
          password:[
           
                { required: true, validator: validatePwd,  trigger: 'blur' } // 自定义验证规则
          ],
          //  checkPass:[
          //      { required: true, validator: checkPwd,  trigger: 'blur' } // 自定义验证规则
          //  ]
        }
      };
    },
    methods: {
      submitForm() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.$router.push('/index')
              // 发送请求给后端
          //  const params ={
          //    account:this.loginForm.account,
          //    password:this.loginForm.password
          //  }
          //    // 发送请求给后端
          //  this.req.post('./login/checklogin',params)
          //  .then(res=>{
            
          //   let { code, reason ,token} =res;

          //   if(code===0){
          //     // 弹成功提示
          //      // 把token存入浏览器
          //     window.localStorage.setItem('token', token);
          //       this.$message({
          //           type: 'success',
          //           message: reason
          //          })
          //            // 跳后端首页
          //          this.$router.push('/index')
          //   }else if(code===1){

          //     this.$message.error(reason)
          //   }
              
          //  })
          //  .catch(err=>{
          //    console.log(err);
             
          //  })
            
          } else {
            console.log('验证失败!');
            return false;
            
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>
<style lang="less" scope>

    @import './Login.less';
    
</style>