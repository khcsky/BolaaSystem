<template>
    <!--首页(项目)组件-->
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
                                :key="item.id"
                                :label="`${item.serialNum}--${item.industryName}`"
                                :value="item.id">
                        </el-option>
                    </el-select>
                  </el-col>

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
            <!-- :activeSon="batchesdel"
            <el-table-column slot="opt">
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
          <el-form :model="accountEditForm" :rules="rules" style="width: 320px;">
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
                  <el-select
                          v-else-if="prop === 'industry'"
                          v-model="searchForm.categoryDialog"
                          filterable
                          remote
                          reserve-keyword
                          placeholder="---选择分类---"
                          :remote-method="remoteCategory"
                          style="width:200px">
                      <el-option
                              v-for="item in options"
                              :key="item.id"
                              :label="`${item.serialNum}--${item.industryName}`"
                              :value="item.id">
                      </el-option>
                  </el-select>
                  <el-radio-group  v-else-if="prop === 'status' && edit === 1" v-model="status">
                      <el-radio :label="0">停用</el-radio>
                      <el-radio :label="1">启用</el-radio>
                  </el-radio-group>
                  <el-input  v-else-if="prop === 'status' && edit === 0"
                             v-model="accountEditForm[prop]"
                             autocomplete="off"
                             readonly></el-input>
                  <el-input v-else-if="prop === 'remark'"
                            type="textarea"
                            :rows="5"
                            v-model="accountEditForm[prop]"
                            autocomplete="off"></el-input>
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
         { prop: 'pname', label: '项目名称' ,width:"70"},
         { prop: 'time', label: '起止时间' ,width:"200"},
         { prop: 'industry', label: '项目行业',width:"70" },
         { prop: 'customerName', label: '客户名' ,width:"70"},
         { prop: 'status', label: '项目状态',width:"70" },
         
     ];
     this.colConfigs = this.colDialog.concat([
         { prop: 'stopTime', label: '停止时间',width:"120" },
         { prop: 'username', label: '操作人' ,width:"70"},
         { prop: 'operateTime', label: '操作时间' ,width:"120"},
         { prop: 'remark', label: '备注', width:"120"},
         { slot: 'opt' }
      ]);
       this.colDialog.push({ prop: 'remark', label: '备注'})
     return {
      //模态框验证
      rules: {
          pname:{ required: true, message: "请输入项目名称", trigger: "blur" },
          customerName:{ required: true, message: "请输入项目行业", trigger: "blur" }
      },
     searchForm: {
         category: '', // 查询项目行业类型
         categoryDialog: '', // 模态框项目行业类型
         keyWord: "" // 查询关键字
     },
      PorTableData: [],  // 项目列表数据
      dialogFormVisible: false, // 控制模态框显示和隐藏
      // 修改表单的数据
      accountEditForm: {
          "projectIndustryName": '',
          "pname": "",
          "time": "",
          "industry": "",
          "customerName": "",
          "status": ""
      },
      formLabelWidth: "100px",
      editId: 0, // 需要修改的数据的id
      editRow: 0, //选中行下标
      selectedId: [], // 选中的id数组
      total: 0,
      listQuery: {
         page: 1, //当前默认页
         limit: 3 //每页多少条数据
      },
      options: [], // 远程搜索
      loading: false,
      edit: 1, // 1:编辑 0:添加
      title: ['添加', '编辑'],
      status: 0 // 状态
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

          let res = await this.$api.project.getList(params);
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
          let {code, page, data, msg} = res.data;

          // token为空,跳转登录页面
          if (code === 5002) {
              this.$message.error(msg || '失败');
              this.$router.push('/login');
              return false;
          }

          // token 过期
          if (code === 5003) {
            window.localStorage.setItem('token', res.data.token);
            this.getList();
            return false;
          }

          // 请求错误
          if (code !== 0) {
              console.log(msg || '错误');
              return false
          }
          try {
              this.total = page.totalRows;
              if ([null, '', undefined].includes(data)) {
                 return false;
              }

              data.map((v, i) => {
                  v.startTime = this.filterCtime(v.startTime);
                  v.endTime = this.filterCtime(v.endTime);
                  data[i]['time'] = v.startTime + '至' + v.endTime;
                  data[i]['timeRange'] = [v.startTime, v.endTime];
                  data[i]['startTime'] = v.startTime;
                  data[i]['endTime'] = v.endTime;
                  data[i]['stopTime'] = this.filterCtime(v.stopTime);
                  data[i]['operateTime'] = this.filterCtime(v.operateTime);
                  data[i]['status'] = ['停用', '启用'][v.status];
                  data[i]['username'] = v.user.username;
                  data[i]['industry'] = v.projectIndustry.serialNum + '---' + v.projectIndustry.industryName;

                  if (this.filterCtime(v.startTime) === '' ||  this.filterCtime(v.startTime) === '') {
                      data[i]['time'] = '';
                  }
              });

              this.PorTableData = data;

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
          let res = await this.$api.project.delete({ pid: row.pid });
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
       // 添加
       if (Object.keys(row).length === 0 || index === -1) {
          this.edit = 0;
          this.status = 1;
          this.searchForm.categoryDialog = '';
          Object.keys(this.accountEditForm).forEach((i, val) => {
              // val = ['projectIndustry'].includes(val) ? val : i === 'status' ?  0 : '';
              val = i === 'status' ?  '启用' : '';
              Reflect.set(this.accountEditForm, i, val);
          });
          return false;
       }
       // 编辑
       this.edit = 1;
       this.status = row.status === '启用' ? 1 : 0;
       this.accountEditForm = row;

      // this.$refs.dialogs.handleEdit(); // 调用子组件的方法
      // 保存数据原来的id
       this.searchForm.categoryDialog = row.projectIndustry.id;
       this.editId = row.pid;
       this.editRow = index
    },
      //保存修改
      async saveEdit() {
       // 关闭模态框
        this.dialogFormVisible = false;
        let params = this.edit === 1 ? Object.assign(this.accountEditForm, {pid: this.editId}) : this.accountEditForm;

        if (!this.accountEditForm.timeRange ||
           (this.accountEditForm.timeRange instanceof Array && this.accountEditForm.timeRange.length < 2)) {
              this.accountEditForm.timeRange = ['', '']
        }
        params.startTime = this.filterCtime(new Date(this.accountEditForm.timeRange[0]), 'YYYY-MM-DD HH:mm:ss');
        params.endTime = this.filterCtime(new Date(this.accountEditForm.timeRange[1]), 'YYYY-MM-DD HH:mm:ss');

        Reflect.deleteProperty(params, 'time');
        Reflect.deleteProperty(params, 'timeRange');

        params.status = this.status;
        this.options.map(it => {
            if (it.id === this.searchForm.categoryDialog) {
                params.projectIndustry = it;
            }
        });

        Reflect.deleteProperty(params, 'stopTime');
        Reflect.deleteProperty(params, 'operateTime');
        Reflect.deleteProperty(params, 'industry');

        let res = this.edit === 1 ? await this.$api.project.update(params) : await this.$api.project.insert(params);
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
    filterCtime(ctime, format = 'YYYY-MM-DD') {
      return [null, '', undefined].includes(ctime) ?  '' : moment(ctime).format(format);
    },
    // 远程搜索
    async  remoteCategory (query = '') {
      let res = await this.$api.project.getRemoteList({nameOrNum: query});
      if (!res || !res.data) {
          return  false;
      }

      let {code, msg, data} = res.data;

      this.loading = true;

      if (code !== 0) {
        this.$message.error(msg || '失败');
        return false;
      }

      this.loading = false;
      this.options = data;

      // if (query === '') {
      //   this.searchForm.category = data[0]['id'];
      // }

    }
  },
  //生命周期钩子函数
   created() {
     this.remoteCategory();
     this.getList();
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