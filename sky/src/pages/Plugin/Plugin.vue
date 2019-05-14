<template>
    <!--插件模块-->
    <div>
      <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>插件列表</span>
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
                    <el-select
                       v-model="searchForm.category"
                       filterable
                       remote
                       reserve-keyword
                       placeholder="---选择分类---"
                       :remote-method="remoteCategory"
                       style="width:200px">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                  </el-col>

                  <el-col :span="5">
                      <el-input v-model="searchForm.keyword" placeholder="请输入关键字"></el-input>
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
            <!--<el-table-column slot="opt">
                <el-button size="mini" slot-scope="{ row }">查看</el-button>
            </el-table-column>-->
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
       <!--
        <Dialogs :title="title" :accountEditForm="accountEditForm" :colConfigs="colConfigs" :dialogFormVisible="dialogFormVisible" :rules="rules"  ref="dialogs"></Dialogs>
        -->
          <!-- 模态框 -->
        <el-dialog width="500px" :title="title[edit]" :visible.sync="dialogFormVisible">
          <!-- 表格 -->
          <el-form :model="accountEditForm" prop="usergroup" :rules="rules" style="width: 320px;">
            <!-- 表单 -->
              <el-form-item
                  v-for="{ prop, label } in colDialog"
                  :key="prop"
                  :prop="prop"
                  :label="label"
                  :label-width="formLabelWidth"
              >
                  <el-date-picker
                      v-if="prop == 'time'"
                      v-model="accountEditForm['timeRange']"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                  </el-date-picker>
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
 import moment from "moment";
 import Table from "../../components/Table/Table"
 import Paging from "../../components/Paging/Paging"
 import {isJSON, isString} from "../../utils/base"

 export default {
   data() {
     this.colDialog = [
         { prop: 'name', label: '插件名字' ,width:"120"},
         { prop: 'xpth', label: '插件xpth' ,width:"120"},
         { prop: 'isAgency', label: '是否代理',width:"120" },
        
         
     ];
     this.colConfigs = this.colDialog.concat([
        
       
         ])
     return {
      rules: {
        //模态框验证
        // 用户名
        account: [
          { required: true, message: "请输入账号", trigger: "blur" }, // 非空验证
          { min: 3, max: 5, message: "账号长度在 3 到 5 位" } // 长度验证
        ]
      },
     searchForm: {
         category: "",
         keyword: ""
     },
      // 项目列表数据
      PorTableData: [],
      dialogFormVisible: false, // 控制模态框显示和隐藏
      accountEditForm: {
        // 修改表单的数据
          pid: "",
          pnamepname: ""
      },
      formLabelWidth: "100px",
      editId: 0, // 需要修改的数据的id
      editRow: 0, //选中行下标
      selectedId: [], // 选中的id数组
      total: 10,
      listQuery: {
         page: 1, //当前默认页
         limit: 3 //每页多少条数据
      },
      options: [], // 远程搜索
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
              page: this.listQuery.page,
              rows:  this.listQuery.limit,
              //category: this.searchForm.category,
              keyWord: this.searchForm.keyword ,
          };
          // sessionStorage.setItem('listQuery', JSON.stringify(this.listQuery));
          let res = await this.$api.plugin.getList(params);

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
          if (code === 5003) {
            window.localStorage.setItem('token', res.data.token);
          }
          if (code !== 0 && code !== 5003) {
              console.log('错误');
              return false
          }
          try {
              data.map((v, i) => {
                  data[i]['time'] = this.filterCtime(v.startTime) + '至' + this.filterCtime(v.startTime);
                  data[i]['timeRange'] = [this.filterCtime(v.startTime), this.filterCtime(v.startTime)];
                  data[i]['startTime'] = this.filterCtime(v.startTime);
                  data[i]['endTime'] = this.filterCtime(v.endTime);
                  data[i]['stopTime'] = this.filterCtime(v.stopTime);
                  data[i]['operateTime'] = this.filterCtime(v.operateTime);
                  if (this.filterCtime(v.startTime) === '' ||  this.filterCtime(v.startTime) === '') {
                      data[i]['time'] = '';
                  }
              });

              this.PorTableData = data;
              this.total = page.pageTotal;

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
          let res = await this.$api.plugin.update({ pid: row.pid });
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
            //type: "info",
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
       this.editId = row.pid;
       this.editRow = index
    },
      //保存修改
      async saveEdit() {
       // 关闭模态框
        this.dialogFormVisible = false;
        let params = this.edit === 1 ? Object.assign(this.accountEditForm, {pid: this.editId}) : this.accountEditForm;
        Reflect.deleteProperty(params, 'time');
        Reflect.deleteProperty(params, 'timeRange');
        let res = this.edit === 1 ? await this.$api.plugin.update(params) : await this.$api.plugin.insert(params);
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
        if (!this.accountEditForm.timeRange) {
            this.accountEditForm.timeRange = ['', ''];
        }
        this.accountEditForm.timeRange[0] = this.filterCtime(new Date(this.accountEditForm.timeRange[0]));
        this.accountEditForm.timeRange[1] = this.filterCtime(new Date(this.accountEditForm.timeRange[1]));
        this.PorTableData[this.editRow]['time'] = this.accountEditForm.timeRange.join('~');
        this.PorTableData[this.editRow]['startTime'] =  this.accountEditForm.timeRange[0];
        this.PorTableData[this.editRow]['endTime'] =  this.accountEditForm.timeRange[1];
        this.PorTableData[this.editRow]['timeRange'] =  this.accountEditForm.timeRange;

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

    filterCtime(ctime) {
      return [null, '', undefined].includes(ctime) ?  '' : moment(ctime).format("YYYY/MM/DD");
    },
    // 远程搜索
    async  remoteCategory (query = '') {
      let res = await this.$api.plugin.getRemoteList({keyword: query});
      if (!res || !res.data) {
          return  false;
      }
      let {code, msg, data} = res.data;
      this.loading = true;
      if (code !== 0) {
        this.$message.error(msg);
        return false;
      }
      this.loading = false;
      this.options = data;
    }
  },
  //生命周期钩子函数
  created() {
   this.getList();
   this.remoteCategory();
  },
 
  
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