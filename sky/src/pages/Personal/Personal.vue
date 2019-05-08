<template>
    <div class="personal">
        <h3>头像上传</h3>
        <el-upload
            ref="upload"
            class="avatar-uploader"
            action="hahahehe"
            :http-request="uploadavatar"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>
<script>
// 引入axios
import axios from 'axios';
export default {
     data() {
      return {
        imageUrl: '',
      };
    },
    methods: {
        // 上传成功 回显图片   
        handleAvatarSuccess(res, file) {
        },
        // 上传之前限制   
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
        
            return isJPG && isLt2M;
        },
        uploadavatar(){}//占位

        // uploadavatar (file) {
        //     console.log(file)

        //     let fd = new FormData(); // 浏览器对象用于上传
        //     fd.append('file', file.file) // 把文件数据加入 fd对象 当成上传的参数

        //     // 获取token
        //     const token = window.localStorage.getItem('token');

        //     // 发送请求
        //     axios.post('/account/uploadavatar', 
        //         fd,
        //         { headers: { 'Content-Type': 'multipart/form-data', 'authorization': `Bearer ${token}`} 
        //     })
        //         .then(response => {
        //             let { code, reason, imgurl } = response.data;
        //             if (code === 0) {
        //                 console.log(imgurl);
                        
        //                 // 回填头像
        //                 // this.imageUrl = `http://127.0.0.1:5777${imgurl} ` ;图片地址
        //                 // 成功提示
        //                 this.$message({
        //                     type: 'success',
        //                     message: reason
        //                 })

        //                 // 触发父组件方法
        //                 this.$emit('updateAvatar')

        //             } else if (code === 1) {
        //                 // 弹失败信息
        //                 this.$message.error(reason)
        //             }
        //         })
        //         .catch(err => {
        //             console.log(err)
        //         })
        // }
    }
}
</script>
<style lang="less">
    .personal {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 200px;
            height: 200px;
            line-height: 200px;
            text-align: center;
        }
        .avatar {
            width: 200px;
            height: 200px;
            display: block;
        }
    }
</style>


