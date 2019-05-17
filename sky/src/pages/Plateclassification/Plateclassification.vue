<template>
    <!--板块采集组件-->
    <div>
      <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>采集列表</span>
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
                                :label="`${item.serialNum}--${item.name}`"
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
            <!--<el-table-column slot="opt">
                <el-button size="mini" slot-scope="{ row }">查看</el-button>
            </el-table-column>-->
            <el-table-column label="状态" slot="opt" >
                <template slot-scope="scope" class="btn">
                    <el-radio-group v-model="scope.row.status" @change="updateStatus(scope.row.status)">
                        <el-radio :label="0">停用</el-radio>
                        <el-radio :label="1">启用</el-radio>
                    </el-radio-group>
                </template>
            </el-table-column>
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
          <el-form :model="accountEditForm" :rules="rules" style="width: 320px;">
            <!-- 表单 -->
              <el-form-item
                  v-for="{ prop, label } in colDialog"
                  v-show="prop !== 'status' && edit === 1 || edit === 0"
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
                          v-else-if="prop === 'industryStr'"
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
                              :label="`${item.serialNum}--${item.name}`"
                              :value="item.id">
                      </el-option>
                  </el-select>
                  <el-date-picker
                          v-else-if="prop == 'gatherTime'"
                          v-model="accountEditForm[prop]"
                          type="date"
                          placeholder="选择下次采集时间">
                  </el-date-picker>
                  <el-radio-group  v-else-if="prop === 'plateSource'" v-model="plateSource" style="width: 300px;">
                      <el-radio :label="1">第三搜索</el-radio>
                      <el-radio :label="2">自由搜索</el-radio>
                      <el-radio :label="3">采集板块</el-radio>
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
     this.colDialog = [
         { prop: 'name', label: '板块名' },
         { prop: 'industryStr', label: '板块分类', width:"120" },
         { prop: 'url', label: '板块地址' },
         { prop: 'time', label: '起止时间', width:"200"},
         { prop: 'plateSource', label: '板块来源', width:"100" },
         { prop: 'interval', label: '间隔时间' },
         { prop: 'gatherTime', label: '下次采集时间', width:"120" },
         { prop: 'netName', label: '站点名' },
     ];
     this.colConfigs = this.colDialog.concat([
         { prop: 'id', label: 'ID' },
         { prop: 'plugId', label: '插件Id' },
         { prop: 'remark', label: '备注' },
         { slot: 'opt' }
         ]);

     this.colDialog.push({ prop: 'remark', label: '备注'});
     this.colDialog.push({ prop: 'status', label: '状态'});
     return {
      rules: {
        // 模态框验证
        name: { required: true, message: "请输入板块名", trigger: "blur" },
        url: { required: true, message: "请输入板块地址", trigger: "blur" },
        interval: [
            { required: true, message: "请选择间隔时间", trigger: "blur" },
            { pattern: /^\d$/, message: '请输入数字类型', trigger: ["blur", "input", "change"]},
           ],
        netName: { required: true, message: "请输入站点名", trigger: "blur" },

      },
     searchForm: {
         category: '', // 查询项目行业类型
         categoryDialog: '', // 模态框项目行业类型
         keyWord: "" // 查询关键字
     },
      // 项目列表数据
      PorTableData: [],
      dialogFormVisible: false, // 控制模态框显示和隐藏
      accountEditForm: {
        // 修改表单的数据
          id: "",
          name: "",
          url: "",
          gatherTime: "",
          netName: "",
          status: "",
          remark: "",
          industryStr: "",
      },
      formLabelWidth: "100px",
      editId: 0, // 需要修改的数据的id
      editRow: 0, // 选中行下标
      selectedId: [], // 选中的id数组
      total: 0,
      listQuery: {
         page: 1, // 当前默认页
         limit: 3 // 每页多少条数据
      },
      options: [], // 远程搜索
      loading: false,
      edit: 1,
      title: ['添加', '编辑'],
      status: 0,
      plateSource: 1 // 板块来源
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
                  rows: this.listQuery.limit,
              },
              keyWord: this.searchForm.keyWord,
              gather: {industry: {id: this.searchForm.category === '' ? 0 : this.searchForm.category}},
          };
          let res = await this.$api.collect.getList(params);
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
          if (code === 5003) {
              window.localStorage.setItem('token', res.data.token);
              this.getList();
              return false;
          }
          if (code !== 0) {
              console.log(msg || '错误');
              return false;
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
                  data[i]['gatherTime'] = this.filterCtime(v.gatherTime);
                  data[i]['industryStr'] = v.industry.serialNum + '---' + v.industry.name;

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
          let res = await this.$api.collect.update({ id: row.id });
           if (!res || !res.data) {
          return  false;
      }
          // 接收后端返回的数据
          let { code, msg } = res.data;

          if (code !== 0) {
            this.$message.error(msg　|| "失败");
            return false;
           }

          // 弹出成功提示
          this.$message({
            type: "success",
            message: msg　|| "成功"
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
           this.plateSource = 1;
           this.status = 1;
           this.searchForm.categoryDialog = '';
           Object.keys(this.accountEditForm).forEach((i, val) => {
               val = i === 'status' ?  '启用' : i === 'plateSource' ?  1 : '';
               Reflect.set(this.accountEditForm, i, val);
           });
           return false;
       }
       // 编辑
       this.edit = 1;
       this.status = row.status === '启用' ? 1 : 0;
       this.plateSource = row.plateSource === '第三搜索' ? 1 : row.plateSource ==='自由搜索' ? 2 : 3;
       this.accountEditForm = row;
      // this.$refs.dialogs.handleEdit(); // 调用子组件的方法
      // 保存数据原来的id
       this.searchForm.categoryDialog = row.industry.id;
       this.editId = row.id;
       this.editRow = index
      
    },
      //保存修改
      async saveEdit() {
        this.dialogFormVisible = false;
        let params = this.edit === 1 ? Object.assign(this.accountEditForm, {id: this.editId}) : this.accountEditForm;

        if (!this.accountEditForm.timeRange ||
            (this.accountEditForm.timeRange instanceof Array && this.accountEditForm.timeRange.length < 2)) {
            this.accountEditForm.timeRange = ['', '']
        }
        params.startTime = this.filterCtime(new Date(this.accountEditForm.timeRange[0]), 'YYYY-MM-DD HH:mm:ss');
        params.endTime = this.filterCtime(new Date(this.accountEditForm.timeRange[1]), 'YYYY-MM-DD HH:mm:ss');
        params.gatherTime = this.filterCtime(new Date(this.accountEditForm.gatherTime), 'YYYY-MM-DD HH:mm:ss');

        Reflect.deleteProperty(params, 'time');
        Reflect.deleteProperty(params, 'timeRange');
        Reflect.deleteProperty(params, 'industryStr');

        params.plateSource = ['', '第三搜索', '自由搜索', '采集板块'][this.plateSource];
        params.status = this.status;
        this.options.map(it => {
           if (it.id === this.searchForm.categoryDialog) {
             params.industry = it;
           }
        });
        if (this.edit === 1) {
            Reflect.deleteProperty(params, 'status');
        }

        let res = this.edit === 1 ? await this.$api.collect.update(params) : await this.$api.collect.insert(params);
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
      let res = await this.$api.collect.getRemoteList({nameOrNum: query});
      if (!res || !res.data) {
         return  false;
      }
      let {code, msg, data} = res.data;
      this.loading = true;
      if (code !== 0) {
           this.$message.error(msg　|| "失败");
        return false;
      }
      this.loading = false;
      this.options = data;
    },
    // 更新状态
    async updateStatus (status) {
       const params = {status};
       let res = await this.$api.collect.updateStatus(params);
       if (!res || !res.data) {
         return  false;
       }
        let {code, msg} = res.data;
        this.loading = true;

        // 请求失败
        if (code !== 0) {
            this.$message.error(msg　|| "失败");
            return false;
        }

        this.loading = false;
        this.$message.success(msg　|| "成功");
        this.getList();
    }
  },
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