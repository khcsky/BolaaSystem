<template>
    <!--客户模块-->
    <div>
      <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>客户列表</span>
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
                    <!-- 删除 -->
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row, scope.$index )">
                        <i class="el-icon-delete"></i> 删除
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
          <el-form :model="accountEditForm"  :rules="rules" style="width: 320px;">
            <!-- 表单 -->
              <el-form-item
                  v-for="{ prop, label } in colDialog"
                  :key="prop"
                  :prop="prop"
                  :label="label"
                  :label-width="formLabelWidth"
              >
                  <el-tooltip
                      v-if="prop === 'name' && edit === 0"
                      class="item"
                      effect="dark"
                      content="客户名添加后不能修改！"
                      placement="top">
                     <el-input v-model="accountEditForm[prop]" autocomplete="off"></el-input>
                  </el-tooltip>
                  <el-input v-else-if="prop === 'name' && edit === 1"
                            v-model="accountEditForm[prop]"
                            autocomplete="off" readonly></el-input>
                  <el-input v-else v-model="accountEditForm[prop]" autocomplete="off" clearable></el-input>
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
 import moment from "moment";
 import Table from "../../components/Table/Table"
 import Paging from "../../components/Paging/Paging"
 import {isJSON, isString} from "../../utils/base"

 export default {
   data() {
      // 模态框列
     this.colDialog = [
         { prop: 'name', label: '客户名称' ,width:"120"},
         { prop: 'companyName', label: '公司名称' ,width:"120"},
         { prop: 'tel', label: '联系方式',width:"120" },
     ];
     // 数据表格列
     this.colConfigs = this.colDialog.concat([
       { slot: 'opt' }
     ]);
     return {
      rules: {
        //模态框验证
          name: { required: true, message: "请输入客户名称", trigger: "blur" },
          companyName:{ required: true, message: "请输入公司名称", trigger: "blur" },
          tel: [
              {required: true, message: '请输入联系方式', trigger: 'blur'},
              {pattern: /^1[34578]\d{9}$/, message: '联系方式格式错误'}
          ]
      },
     searchForm: {keyWord: ""},
      PorTableData: [], // 项目列表数据
      dialogFormVisible: false, // 控制模态框显示和隐藏
      // 修改表单的数据
      accountEditForm: {
          name: "",
          companyName: "",
          tel: "",
      },
      formLabelWidth: "100px",
      editId: 0, // 需要修改的数据的id
      editRow: 0, //选中行下标
      total: 0, // 总条数
      listQuery: {
         page: 1, //当前默认页
         limit: 3 //每页多少条数据
      },
      loading: false,
      edit: 1, // 1: 编辑 0:添加
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
          let res = await this.$api.client.getList(params);
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
            this.$router.push('/login');
            return false;
          }
          let {code, page, data} = res.data;

          // token过期
          if (code === 5003) {
            window.localStorage.setItem('token', res.data.token);
            this.getList();
            return false;
          }

          // 请求错误
          if (code !== 0) {
              console.log('错误');
              return false
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
      //删除函数
      handleDelete(row) {
      // 优化删除体验
        this.$confirm("是否确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
         type: "warning"
      })
        .then(async () => {
          let res = await this.$api.client.delete({ id: row.id });
          if (!res || !res.data) {
             return  false;
          }
          // 接收后端返回的数据
          let { code, msg } = res.data;

          if (code !== 0) {
            this.$message.error(msg || '错误');
            return false;
           };

          // 弹出成功提示
          this.$message({
            type: "success",
            message: msg || "成功"
          });

          // 刷新列表数据
          this.getList();
        })
        .catch(() => {
          // 取消
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
      //修改函数
      handleEdit(row = {}, index = -1) {
      // 显示模态框
       this.dialogFormVisible = true;
       if (Object.keys(row).length === 0 || index === -1) {
          this.edit = 0;
          Object.keys(this.accountEditForm).forEach(i => {
              Reflect.set(this.accountEditForm, i, '');
          });
          return false;
       }
       this.edit = 1;
       this.accountEditForm = row;
      // this.$refs.dialogs.handleEdit(); // 调用子组件的方法
      // 保存数据原来的id
       this.editId = row.id;
       this.editRow = index
    },
      //保存修改
      async saveEdit() {
       // 关闭模态框
        this.dialogFormVisible = false;
        let params = this.edit === 1 ? Object.assign(this.accountEditForm, {id: this.editId}) : this.accountEditForm;

        Reflect.deleteProperty(params, 'time');
        Reflect.deleteProperty(params, 'timeRange');

        let res = this.edit === 1 ? await this.$api.client.update(params) : await this.$api.client.insert(params);
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
          message: msg || '成功'
        });
     
        // 刷新列表数据
        this.getList();
     },
    //取消选择
    cancelselect() {
      this.$refs.PorTableData.clearSelection(); // 整个表格调用取消选择方法
    },
    // 当选择项发生改变触发
    handleSelectionChange(val) {
      // // val就是选中的数据 把选中数据的id取出来 放在一个数组中
      this.selectedId = val.map(v => v.id);
    },

    filterCtime(ctime, format = 'YYYY-MM-DD') {
          return [null, '', undefined].includes(ctime) ?  '' : moment(ctime).format(format);
    }
  },
  //生命周期钩子函数
  created() {
    this.getList();
  }
 
  
 }
</script>

<style lang="less">

.cell .el-button+.el-button{
  margin: 0;
}
 .el-card {
    .el-card__header {
      font-size: 18px;
      font-weight: 700;
      background-color: #f1f1f1;
    }
  }
.el-table .cell{
  font-size: 12px;
  padding-left: 4px;
  padding-right: 4px;
  width: auto;
}

</style>