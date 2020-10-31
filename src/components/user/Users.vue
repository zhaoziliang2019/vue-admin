<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="box-card">
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.key"
            clearable
            @clear="getUserList"
          >
            <el-button
              @click="getUserList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!--用户列表区域-->
      <el-table   :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="昵称" prop="uRealName"></el-table-column>
        <el-table-column label="用户名" prop="uLoginName"></el-table-column>
        <el-table-column label="手机号" prop="uPhone"></el-table-column>
        <el-table-column label="邮箱" prop="uEmail"></el-table-column>
        <el-table-column label="地址" prop="uAddress"></el-table-column>
        <el-table-column label="角色名" width="180">
           <template slot-scope="scope">
                    <el-tag v-for="item in scope.row.rNames" :key="item.Id" >{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="性别"
          prop="uSex"
          :formatter="formatterSex"
          width="50"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="uCreateTime"
          :formatter="formatDateTime"
        ></el-table-column>
        <el-table-column
          label="最近登录时间"
          prop="uLastErrTime"
          :formatter="formatDateTime"
        ></el-table-column>
        <!-- <el-table-column label="状态" width="70">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.uIsDelete"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.uID)"
            ></el-button>
            <!--删除-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.uID)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--添加用户的对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!--内容主体区域-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="昵称" prop="uRealName">
          <el-input v-model="addForm.uRealName"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="uLoginName">
          <el-input v-model="addForm.uLoginName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="uPassWord">
          <el-input v-model="addForm.uPassWord"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="uSex">
          <el-radio-group v-model="addForm.uSex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="uEmail">
          <el-input v-model="addForm.uEmail"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="uPhone">
          <el-input v-model="addForm.uPhone"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="uAddress">
          <el-input type="textarea" v-model="addForm.uAddress"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户的对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!--内容主体区域-->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="昵称" prop="uRealName">
          <el-input v-model="editForm.uRealName"></el-input>
        </el-form-item>
        <el-form-item label="登录名">
          <el-input v-model="editForm.uLoginName" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="uSex">
          <el-radio-group v-model="editForm.uSex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="uEmail">
          <el-input v-model="editForm.uEmail"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="uPhone">
          <el-input v-model="editForm.uPhone"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="uAddress">
          <el-input type="textarea" v-model="editForm.uAddress"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="rIDs">
          <el-select
            v-model="editForm.rIDs"
            multiple
            filterable
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in roles"
              :key="item.rID"
              :label="item.rName"
              :value="item.rID"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regEmail.test(value)) {
        //合法的邮箱
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    //验证手机号的规则
    var checkPhone = (rule, value, cb) => {
      //验证手机号的正则表达式
      const regPhone = /^1[3456789]\d{9}$/;
      if (regPhone.test(value)) {
        //合法的手机号
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      //获取用户列表参数对象
      queryInfo: {
        key: "",
        //当前的页数
        page: 1,
        pagesize: 10,
      },
      roles: [],
      userlist: [],
      total: 0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      //控制修改用户对话框的显示与隐藏
      editdialogVisible: false,
      //添加用户的表单数据
      addForm: {
        uLoginName: "",
        uRealName: "",
        uPassWord: "",
        uSex: 1,
        uEmail: "",
        uPhone: "",
        uAddress: "",
      },

      //添加表单的验证规则对象
      addFormRules: {
        uLoginName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3~10 个字符", trigger: "blur" },
        ],
        uRealName: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 3, max: 100, message: "长度在 3~100 个字符", trigger: "blur" },
        ],
        uPassWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6~15个字符", trigger: "blur" },
        ],
        uSex: [{ required: true, message: "请选择性别", trigger: "change" }],
        uEmail: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        uPhone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
        uAddress: [
          { required: true, message: "请输入地址", trigger: "blur" },
          { min: 6, max: 100, message: "长度在 6~100个字符", trigger: "blur" },
        ],
      },
      //查询到得用户信息对象
      editForm: {},
      //修改表单的验证规则对象
      editFormRules: {
        uLoginName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3~10 个字符", trigger: "blur" },
        ],
        uRealName: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 3, max: 100, message: "长度在 3~100 个字符", trigger: "blur" },
        ],
        uSex: [{ required: true, message: "请选择性别", trigger: "change" }],
        uEmail: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        uPhone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
        uAddress: [
          { required: true, message: "请输入地址", trigger: "blur" },
          { min: 6, max: 100, message: "长度在 6~100个字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("user/users", {
        params: this.queryInfo,
      });
      //console.log(res);
      if (!res.success) return this.$message.error(res.msg);
      this.userlist = res.response.data;
      this.total = res.response.dataCount;
    },
    //格式化性别列
    formatterSex: function (row, column) {
      return row.uSex == 1 ? "男" : row.uSex == 2 ? "女" : "未知";
    },
    formatDateTime: function (row, column, cellValue, index) {
      return cellValue.replace("T", " ");
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      //console.log(newPage);
      this.queryInfo.page = newPage;
      this.getUserList();
    },
    //监听switch开关事件
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `/user/userstate?userid=${userInfo.uID}&status=${userInfo.uIsDelete}`
      );
      if (!res.success) {
        userInfo.uIsDelete = !userInfo.uIsDelete;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮，添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        //console.log(valid)
        if (!valid) return;
        //添加用户的网络请求
        let para = Object.assign({}, this.addForm);
        const { data: res } = await this.$http.post(`user/adduser`, para);
        if (!res.success) return this.$message.error(res.msg);
        this.$message.success("添加用户成功！");
        //隐藏添加用户的对话框
        this.addDialogVisible = false;
        //重新获取用户列表
        this.getUserList();
      });
    },
    //展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`user/userinfo`, {
        params: { uid: id },
      });
      if (!res.success) return this.$message.error(res.msg);
      const { data: re } = await this.$http.get(`roles/rolelist`);
      if (!re.success) return this.$message.error(re.msg);
      this.roles = re.response;
      console.log(re.response);
      this.editForm = res.response;
      this.editdialogVisible = true;
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(this.editForm);
        if (!valid) return;
        //发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          "user/updateuser",
          this.editForm
        );
        if (!res.success) return this.$message.error("更新用户信息失败！");
        //关闭对话框
        this.editdialogVisible = false;
        //刷新数据列表
        this.getUserList();
        //提示修改成功
        this.$message.success("更新用户信息成功！");
      });
    },
    //根据id删除对应的用户信息
    removeUserById(id) {
      //询问用户是否删除数据
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //删除用户信息
          const { data: res } = await this.$http.delete("user/deleteuser", {
            params: { uid: id },
          });
          if (!res.success) return this.$message.error(res.msg);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          //重新获取数据
          this.getUserList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style lang="less" scoped>
</style>