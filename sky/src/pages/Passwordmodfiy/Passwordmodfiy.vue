<template>
  <div class="password-modfiy">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>密码修改</span>
      </div>
      <div class="text item">
        <el-form
          :model="updateForm"
          status-icon
          :rules="rules"
          ref="updateForm"
          label-width="100px"
          class="demo-ruleForm"
          style="width:300px"
          size="small"
        >
          <!--密码 -->
          <el-form-item label="原密码" prop="oldpwd">
            <el-input type="text" v-model="updateForm.oldpwd" autocomplete="off" clearable></el-input>
          </el-form-item>

          <el-form-item label="新密码" prop="newpwd">
            <el-input type="password" v-model="updateForm.newpwd" autocomplete="off" clearable></el-input>
          </el-form-item>

          <el-form-item label="确认新密码" prop="checknewpwd">
            <el-input type="password" v-model="updateForm.checknewpwd" autocomplete="off" clearable></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updatepwdForm()">修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>

export default {
  data() {
      //旧密码非空 长度验证
   const oldpwd =(rule, value, callback)=>{
             if(value===''){
                  callback(new Error('原密码不能为空')); 
             }else if(value.length<6||value.length>12){
                 callback(new Error('长度在 6 到 12 个字符'));
             }
                  // 成功的回调
                 callback();
             
         }
    //验证 新密码
    const newpwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value.length < 6 || value.length > 12) {
        callback(new Error("长度在 6 到 12 个字符"));
      } else if (value === this.updateForm.oldpwd) {
        callback(new Error("不能和旧密码相同"));
      } else {
        if (this.updateForm.checknewpwd !== "") {
          this.$refs.updateForm.validateField("checknewpwd");
        }
        callback(); // 成功
      }
    };
    //验证 确认新密码

    const checknewpwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认新密码"));
      } else if (value.length < 6 || value.length > 12) {
        callback(new Error("长度在 6 到 12 个字符"));
      } else if (value !== this.updateForm.newpwd) {
        // 一致性验证
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      updateForm: {
        oldpwd: "", // 旧密码
        newpwd: "", // 新密码
        checknewpwd: "" // 确认新密码
      },
      rules: {
        oldpwd: [
          {required: true, validator: oldpwd, trigger: "blur" },
          { min: 6, max: 18, message: "长度在 6 到18 位" }
        ],
        newpwd: [
          { required: true, validator: newpwd, trigger: "blur" },
          { min: 6, max: 18, message: "长度在 6 到18 位" }
        ],
        checknewpwd: [
          { required: true, validator: checknewpwd, trigger: "blur" },
          { min: 6, max: 18, message: "长度在 6 到18 位" }
        ]
      }
    };
  },
  methods: {
    updatepwdForm() {
      this.$refs.updateForm.validate(async valid => {
        if (!valid) {
          console.log("验证失败!");
          return false;
        }
        let params = {
          oldPassword : this.updateForm.oldpwd,
          newPassword: this.updateForm.newpwd,
          affirmPassword: this.updateForm.checknewpwd,
        };

          //发送请求给后端 把新旧密码发给后端
         let res = await this.$api.login.updatePwd(params);
         if (!res || !res.data) {
            return  false;
         }

         let { code ,msg} = res.data;
        if (code === 5003) {
          window.localStorage.setItem('token', res.data.token);
          this.updatepwdForm();
          return false;
        }
         if (code !== 0) {
            this.$message.error(msg || '失败');
             return false;
          }

          // 弹成功提示
          this.$message({
            type: "success",
            message: msg || '成功'
          });

           // 清除token
           window.localStorage.removeItem("token");

            setTimeout(() => {
              // 跳转到登录
              this.$router.push("/login");
            }, 1000);
      });
    }
  }
};
</script>
<style lang="less">
.password-modfiy {
  .el-card {
    .el-card__header {
      font-size: 18px;
      font-weight: 700;
      background-color: #f1f1f1;
    }
  }
}
</style>