<template>
    <div class="login">
        <div class="login-wrapper">
            <h2 class="title">
                <span class="icon iconfont">&#xe641;</span>
                <span class="title_word">欢迎来到Bolaa管理系统</span>
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

                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
                    <el-button @click="resetForm('loginForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            // 自定义验证密码规则 /^[a-zA-Z0-9] {4,6}$/.test(trim(value))
            let validatePwd =(rule, value, callback)=>{
                if (value === '') {
                    callback(new Error('请输入密码'));
                    return false;
                }
                if (value.length < 4 || value.length > 12) {
                    callback(new Error('长度在 4 到 12 个字符'));
                    return false;
                }

                // 成功的回调
                callback();

            }
            // 自定义验证确认密码函数
            let checkPwd = (rule, value, callback)=>{
                if (value === ''){
                    callback(new Error('请再次输入密码'));
                    return false;
                }
                callback(); // 直接调用就是成功
            }
            return {
                loginForm: {
                    account: '',// 账号
                    password: '',// 密码
                },
                rules: {
                    // 账号验证
                    account:[
                        { required: true, message: '请输入账号', trigger: 'blur' }, // 非空验证
                        { min: 3, max: 5, message: '长度在 3 到 6 个字符', trigger: 'blur' } //
                    ],
                    // 密码验证
                    password:[
                        { required: true, validator: validatePwd,  trigger: 'blur' } // 自定义验证规则
                    ],
                    checkPass:[
                        { required: true, validator: checkPwd,  trigger: 'blur' } // 自定义验证规则
                    ]
                }
            };
        },
        methods: {
            submitForm() {
                this.$refs.loginForm.validate(async (valid) => {
                    if (!valid) {
                        console.log('验证失败!');
                        return false;
                    }
                    // debugger
                    // 发送请求给后端
                    const params ={
                        username: this.loginForm.account,
                        password: this.loginForm.password
                    };

                    let res = await this.$api.login.login(params);
                    if (!res || !res.data) {
                        return false;
                    }
                    let {code, token, userId, username, msg} = res.data;

                    if (code !== 0) {
                        this.$message.error(msg || '登陆失败');
                        return  false;
                    }

                    window.localStorage.setItem('token', token);
                    window.localStorage.setItem('userId', userId);
                    window.localStorage.setItem('username', username);

                    this.$message({
                        type: 'success',
                        message: '登陆成功'
                    });
                    this.$router.push('/index');

                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        created() {
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('userId');
            window.localStorage.removeItem('username');
        }
    }
</script>
<style lang="less">
    @import './Login.less';
</style>