<template>
    <!--板块分类组件-->
    <div>
      <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>分类列表</span>
      </div>

      <div class="text item">
          <el-form
              :model="searchForm"
              status-icon
              :rules="rules"
              ref="searchForm"
              label-width="100px"
              class="demo-ruleForm"
              size="small">
              <el-row type="flex" class="row-bg">
                  <el-col :span="5">
                      <el-input v-model="searchForm.keyWord" placeholder="请输入关键字"></el-input>
                  </el-col>

                  <el-col :span="5">
                      <el-button type="success" @click="getList">查询</el-button>
                  </el-col>
                  <el-col :span="5">
                      <el-button type="primary" @click="handleEdit">添加</el-button>
                  </el-col>
              </el-row>
          </el-form>
        <Table :PorTableData="PorTableData" :colConfigs="colConfigs">
            <el-table-column label="管理" slot="opt" >
                <template slot-scope="scope" class="btn">
                    <!-- 编辑 -->
                    <el-button size="mini" type="primary" @click="handleEdit(scope.row, scope.$index)">
                        <i class="el-icon-edit"></i> 编辑
                    </el-button>
                </template>
            </el-table-column>
        </Table>
        <Paging
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList" />
          <!-- 模态框 -->
        <el-dialog width="500px" :title="title[edit]" :visible.sync="dialogFormVisible">
          <!-- 表格 -->
          <el-form :model="accountEditForm" :rules="rules" style="width: 320px;">
            <!-- 表单 -->
              <el-form-item
                  v-for="{ prop, label } in colDialog"
                  :key="prop"
                  :prop="prop"
                  :label="label"
                  :label-width="formLabelWidth"
              >
                  <el-tooltip
                          v-if="prop === 'serialNum' && edit === 0"
                          class="item"
                          effect="dark"
                          content="分类编号添加后不能修改！"
                          placement="top">
                      <el-input v-model.number="accountEditForm[prop]" autocomplete="off" rules.serialNum = ''></el-input>
                  </el-tooltip>
                  <el-input v-else-if="prop === 'serialNum' && edit === 1"
                            v-model="accountEditForm[prop]"
                            autocomplete="off" readonly></el-input>
                  <el-input v-else v-model="accountEditForm[prop]" autocomplete="off"></el-input>
              </el-form-item>
          </el-form>

          <!-- 尾部 -->
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
    </div>
</template>

<script>
 import Table from "../../components/Table/Table"
 import Paging from "../../components/Paging/Paging"
 import {isJSON, isString} from "../../utils/base"

 export default {
   data() {
     this.colDialog = [
         { prop: 'serialNum', label: '分类编号', width:"180" },
         { prop: 'name', label: '分类名',width:"180" },
     ];
     this.colConfigs = this.colDialog.concat([
         { slot: 'opt' }
      ])
     return {
       // 模态框验证
      rules: {
          serialNum: { required: true, message: "请输入分类编号", trigger: "blur" },
          name:{ required: true, message: "请输入分类名", trigger: "blur" }
      },
     searchForm: {
         keyWord: ""
     },
      // 项目列表数据
      PorTableData: [],
      dialogFormVisible: false, // 控制模态框显示和隐藏
      accountEditForm: {
        // 修改表单的数据
          serialNum: "",
          name: ""
      },
      formLabelWidth: "100px",
      editId: 0, // 需要修改的数据的id
      editRow: 0, // 选中行下标
      total: 0, // 总条数
      listQuery: {
         page: 1, // 当前默认页
         limit: 3 // 每页多少条数据
      },
      loading: false,
      edit: 1,
      title: ['添加', '编辑']
     };
   },
   components: {
     Table,
     Paging,
   },
  methods: {
       // 请求列表数据
      async getList () {
          const params = {
              page: {
                  page: this.listQuery.page,
                  rows:  this.listQuery.limit,
              },
              keyWord: this.searchForm.keyWord,
          };

          let res = await this.$api.plate.getList(params);
          if (!res || !res.data) {  
              return  false;
          }
          if (isString(res.data)) {
              res.data = res.data.replace(/'/g, '"');
          }
          if (isJSON(res.data)) {
              res.data = JSON.parse(res.data);
          }
          if (res.data.code === 5001) {
              window.localStorage.removeItem('token');
              window.localStorage.removeItem('userId');
              window.localStorage.removeItem('username');
          }

          let {code, page, data, msg} = res.data;

          // token为空,跳转登录页面
          if (code === 5002) {
              this.$message.error(msg || '失败');
              this.$router.push('/login');
              return false;
          }
          // token过期
          if (code === 5003) {
              window.localStorage.setItem('token', res.data.token);
              this.getList();
              return false;
          }
          // 请求错误
          if (code !== 0) {
              console.log(msg || '错误');
              return false;
          }
          try {

              this.PorTableData = data;
              this.total = page.totalRows;

              // 如果数据为空 （优化 当当前页码数据为空 跳转到上一页）
              if (!data && this.listQuery.page !== 1) {
                this.currentPage -= 1;  // 当前页码自减1
                this.getList(); // 再次请求数据
              }
          } catch (e) {
              console.log('错误', e);
          }

      },
      pagination (val) {
          this.listQuery = val;
          this.getList();
      },
      //修改函数
      handleEdit(row = {}, index = -1) {
      // 显示模态框
       this.dialogFormVisible = true;

       // 添加
       if (Object.keys(row).length === 0 || index === -1) {
           this.edit = 0;
           Object.keys(this.accountEditForm).forEach(i => {
               Reflect.set(this.accountEditForm, i, '');
           });
           return false;
       }

       // 编辑
      this.edit = 1;
      this.accountEditForm = row;
      // this.$refs.dialogs.handleEdit(); // 调用子组件的方法
      // 保存数据原来的id
       this.editId = row.id;
       this.editRow = index;
    },
    //保存修改
    async saveEdit() {
        // 关闭模态框
        this.dialogFormVisible = false;
        let params = this.edit === 1 ? Object.assign(this.accountEditForm, {id: this.editId}) : this.accountEditForm;

        let res = this.edit === 1 ? await this.$api.plate.update(params) : await this.$api.plate.insert(params);
        if (!res || !res.data) {
           return  false;
        }

        let { code, msg } = res.data;
        if (code !== 0) {
          this.$message.error(msg || '失败');
          return false;
        }

        // 弹出成功提示
        this.$message({
          type: "success",
          message: msg || "成功"
        });

        // 刷新列表数据
        this.getList();
    },
  },
  //生命周期钩子函数
  created() {
    this.getList();
  },

 }
</script>

<style lang="less">

.cell .el-button+.el-button{
  margin: 0;
}
</style>