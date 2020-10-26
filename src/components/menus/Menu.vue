<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加菜单</el-button>
        </el-col>
      </el-row>
      <!--菜单列表区域-->
      <el-table
        :data="menulist"
        border
        stripe
        row-key="mID"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="菜单名" prop="mName"></el-table-column>
        <el-table-column label="路由路径" prop="mPath"></el-table-column>
        <el-table-column label="菜单图标" prop="mIcon"></el-table-column>
        <el-table-column label="菜单描述" prop="mDescription"></el-table-column>
        <el-table-column label="创建人" prop="mCreateBy"></el-table-column>
        <el-table-column label="创建时间" prop="mCreateTime"></el-table-column>
        <el-table-column label="修改人" prop="mModifyBy"></el-table-column>
        <el-table-column label="修改时间" prop="mUpdateTime"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.mID)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeMenuById(scope.row.mID)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加菜单对话框-->
    <el-dialog
      title="添加菜单"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item label="父级菜单" width="" prop="arrPid">
          <el-cascader
            :options="moptions"
            change-on-select
            emitPath="false"
            style="width: 400px"
            clearable
            placeholder="请选择父级菜单"
            v-model="addForm.arrPid"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="菜单名" prop="mName">
          <el-input v-model="addForm.mName"></el-input>
        </el-form-item>
        <el-form-item label="路由路径" prop="mPath">
          <el-tooltip
            effect="dark"
            content="例如：根节点：-,其他节点：/roles"
            placement="top"
          >
            <el-input v-model="addForm.mPath"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="排序" prop="mOrderSort">
          <el-input v-model="addForm.mOrderSort"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="mIcon">
          <el-tooltip
            effect="dark"
            content="例如：el-icon-menu"
            placement="top"
          >
            <el-input v-model="addForm.mIcon"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="描述" prop="mDescription">
          <el-input v-model="addForm.mDescription"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑菜单对话框-->
    <el-dialog title="编辑菜单" :visible.sync="editDialogVisible" width="50%">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
        @close="editDialogClosed"
      >
        <el-form-item label="父级菜单" width="" prop="arrPid">
          <el-cascader
            :options="moptions"
            change-on-select
            emitPath="false"
            style="width: 400px"
            clearable
            placeholder="请选择父级菜单"
            v-model="editForm.arrPid"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="菜单名" prop="mName">
          <el-input v-model="editForm.mName"></el-input>
        </el-form-item>
        <el-form-item label="路由路径" prop="mPath">
          <el-tooltip
            effect="dark"
            content="例如：根节点：-,其他节点：/roles"
            placement="top"
          >
            <el-input v-model="editForm.mPath"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="排序" prop="mOrderSort">
          <el-input v-model="editForm.mOrderSort"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="mIcon">
          <el-tooltip
            effect="dark"
            content="例如：el-icon-menu"
            placement="top"
          >
            <el-input v-model="editForm.mIcon"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="描述" prop="mDescription">
          <el-input v-model="editForm.mDescription"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMenuInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //菜单列表
      menulist: [],
      //添加菜单对话框显示与隐藏
      addDialogVisible: false,
      //添加菜单对象
      addForm: {
        arrPid: [],
      },
      //父级菜单列表
      moptions: [],
      //添加菜单验证规则对象
      addFormRules: {
        mPid: [{ required: true, message: "请输入菜单名", trigger: "blur" }],
        mName: [
          { required: true, message: "请输入菜单名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3~10 个字符", trigger: "blur" },
        ],
        mPath: [{ required: true, message: "请输入路由路径", trigger: "blur" }],
        mOrderSort: [
          { required: true, message: "请输入排序", trigger: "blur" },
        ],
        mIcon: [{ required: true, message: "请输入排序", trigger: "blur" }],
        mDescription: [
          { required: true, message: "请输入排序", trigger: "blur" },
          { min: 3, max: 100, message: "长度在 3~100 个字符", trigger: "blur" },
        ],
      },
      //编辑菜单对话框显示与隐藏
      editDialogVisible: false,
      //编辑菜单对象
      editForm: {},
      //编辑菜单验证规则对象
      editFormRules: {
        mPid: [{ required: true, message: "请输入菜单名", trigger: "blur" }],
        mPath: [{ required: true, message: "请输入路由路径", trigger: "blur" }],
        mOrderSort: [
          { required: true, message: "请输入排序", trigger: "blur" },
        ],
        mIcon: [{ required: true, message: "请输入排序", trigger: "blur" }],
        mDescription: [
          { required: true, message: "请输入排序", trigger: "blur" },
          { min: 3, max: 100, message: "长度在 3~100 个字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    //获取所有的菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get(`menus/list`);
      if (!res.success) return this.$message.error(res.msg);
      this.menulist = res.response;
    },
    //监听关闭添加菜单对话框事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //显示菜单添加对话框
    async showAddDialog() {
      this.addDialogVisible = true;
      const { data: res } = await this.$http.get(`menus/rootlist`);
      if (!res.success) return this.$message.error(res.msg);
      this.moptions = res.response.children;
    },
    //添加菜单
    addMenu() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        this.addForm.mPid = this.addForm.arrPid.pop();
        //不知道什么原因int数字老是转成string导致无法进去接口
        this.addForm.mOrderSort = parseInt(this.addForm.mOrderSort);
        const { data: res } = await this.$http.post(
          "menus/addmenu",
          this.addForm
        );
        if (!res.success) return this.$message.error(res.msg);
        this.$message.success("添加菜单成功！");
        //隐藏添加菜单对话框
        this.addDialogVisible = false;
        //重新获取菜单列表数据
        this.getMenuList();
      });
    },
    //显示编辑菜单对话框
    async showEditDialog(id) {
      //根据id获取菜单信息
      const { data: res } = await this.$http.get(`menus/menu`, {
        params: { mid: id },
      });
      if (!res.success) return this.$message.error(res.msg);
      this.editForm = res.response;
      console.log(this.editForm);
      //父级菜单选择列表
      const { data: re } = await this.$http.get(`menus/rootlist`);
      if (!re.success) return this.$message.error(re.msg);
      this.moptions = re.response.children;

      this.editDialogVisible = true;
    },
    //监听关闭编辑菜单事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //编辑菜单
    editMenuInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        this.editForm.mPid = this.editForm.arrPid.pop();
        const { data: res } = await this.$http.put(
          `menus/updatemenu`,
          this.editForm
        );
        if (!res.success) return this.$message.error(res.msg);
        this.editDialogVisible = false;
        //刷新菜单列表
        this.getMenuList();
        this.$message.success("更新菜单成功!");
      });
    },
    //删除菜单
    removeMenuById(id){
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
        const {data:res}=await this.$http.delete(`menus/delete`,{params:{id:id}})
         if(!res.success) return this.$message.error(res.msg)
         this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //刷新菜单列表
          this.getMenuList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
};
</script>
<style lang="less" scoped>
</style>