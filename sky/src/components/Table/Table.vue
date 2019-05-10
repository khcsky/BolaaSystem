<template>
    <!--table组件-->
    <div class="text item">
        <el-table :data="PorTableData" ref="PorTableData" @selection-change="handleSelectionChange">
            <!--多选框-->
            <!--<el-table-column type="selection" width="55"></el-table-column>-->

            <!--table列-->
            <template v-for="(colConfig, index) in colConfigs">
                <!--如果插入列-->
                <slot v-if="colConfig.slot" :name="colConfig.slot" ></slot>
               <!-- <component
                            v-else-if="colConfig.component"
                            :is="colConfig.component"
                            :col-config="colConfig">
                </component>-->

                <!--否则显示列数据-->
                <el-table-column v-else v-bind="colConfig"></el-table-column>
            </template>



        </el-table>
        <!--<div style="margin-top:20px;">
            <el-button @click="batchesdel" type="danger">批量删除</el-button>
            <el-button @click="cancelselect" type="primary">取消选中</el-button>
        </div>-->
    </div>
</template>

<script>
export default {
    name: "Table",
    props: ['PorTableData', 'colConfigs', 'activeSon'],
    data() {
        return {
            selectedId: []
        }
    },
    methods: {
        handleDelete(id, url) {
            // // 优化删除体验
            // this.$confirm("是否确定删除?", "提示", {
            //   confirmButtonText: "确定",
            //   cancelButtonText: "取消",
            //   type: "warning"
            // })
            // .then(() => {
            //   this.req
            //     .get(url, { id })
            //     .then(res => {
            //       // 接收后端返回的数据
            //       let { code, reason } = res;
            //       // 判断
            //       if (code === 0) {
            //         // 弹出成功提示
            //         this.$message({
            //           type: "success",
            //           message: reason
            //         });
            //         // 刷新列表数据
            //         this.getAccontListByPage();
            //       } else if (code === 1) {
            //         this.$message.error(reason);
            //       }
            //     })
            //     .catch(err => {
            //       console.log(err);
            //     });
            // })
            // .catch(() => {
            //   // 取消
            //   this.$message({
            //     type: "info",
            //     message: "已取消删除"
            //   });
            // });
        },
        handleEdit(id) {

        },
        handleSelectionChange(val) {
            // this.$parent.handleSelectionChange()
            this.selectedId = val.map(v => v.pid);
            console.log(this.$parent, this.selectedId)
        },
        //取消选择
        cancelselect() {
            this.$refs.PorTableData.clearSelection(); // 整个表格调用取消选择方法
        },
        //批量删除
        batchesdel() {
            // 如果用户不选 弹出提示 直接return
            this.$parent.selectedId = this.selectedId;
            this.activeSon()
       },
    }
}
</script>

<style>

</style>