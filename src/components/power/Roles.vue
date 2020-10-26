<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card class="box-card">
      <!--搜索与添加区域-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!--角色列表区域-->
      <el-table :data="rolelist" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="item1 in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', 'vcenter']"
            >
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag
                  @close="removeRightById(scope.row, item1.id)"
                  closable
                  >{{ item1.name }}</el-tag
                ><i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级和三级权限-->
              <el-col :span="19">
                <!--通过for循环且套渲染二级权限-->
                <el-row
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  :class="['bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      @close="removeRightById(scope.row, item2.id)"
                      closable
                      type="success"
                      >{{ item2.name }}</el-tag
                    ><i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!--三级权限-->
                    <el-tag
                      @close="removeRightById(scope.row, item3.ID)"
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.ID"
                      >{{ item3.name }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="name"></el-table-column>
        <el-table-column label="描述" prop="description"></el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          :formatter="formatDateTime"
        ></el-table-column>
        <el-table-column label="创建人" prop="createBy"></el-table-column>
        <el-table-column
          label="修改时间"
          prop="updateTime"
          :formatter="formatDateTime"
        ></el-table-column>
        <el-table-column label="修改人" prop="modifyBy"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetPermissionDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加角色对话框-->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form
        ref="addFormRef"
        :rules="addFormRules"
        :model="addForm"
        label-width="80px"
      >
        <el-form-item label="角色名" prop="rName">
          <el-input v-model="addForm.rName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="rDescription">
          <el-input v-model="addForm.rDescription"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑角色对话框-->
    <el-dialog title="编辑角色" :visible.sync="editdialogVisible" width="50%" @close="editDialogClosed">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名">
          <el-input v-model="editForm.rName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="rDescription">
          <el-input v-model="editForm.rDescription"></el-input>
        </el-form-item>
        <el-form-item label="关闭" prop="rIsDelete">
          <el-switch v-model="editForm.rIsDelete"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--分配权限的对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setPermissionDialogVisible"
      width="50%"
      @close="setPermissionDialogClosed"
    >
      <!--树形控件-->
      <el-tree
        :data="permissionlist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setPermissionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allPermission">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //添加角色对话框显示与隐藏
      addDialogVisible: false,
      //添加角色表单数据
      addForm: {
        rName: "",
        rDescription: "",
      },
      //添加角色的验证规则对象
      addFormRules: {
        rName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          { min: 3, max: 100, message: "长度在 3~100 个字符", trigger: "blur" },
        ],
        rDescription: [
          { required: true, message: "请输入角色的描述", trigger: "blur" },
          { min: 3, max: 100, message: "长度在 3~100 个字符", trigger: "blur" },
        ],
      },
      //编辑角色对话框显示与隐藏
      editdialogVisible: false,
      //编辑角色表单数据
      editForm: {},
      //编辑角色的验证规则对象
      editFormRules: {
        rDescription: [
          { required: true, message: "请输入角色的描述", trigger: "blur" },
          { min: 3, max: 100, message: "长度在 3~100 个字符", trigger: "blur" },
        ],
        rIsDelete: [
          { required: true, message: "请选中角色状态", trigger: "blur" },
        ],
      },
      //所有角色列表
      rolelist: [],
      //控制分配权限的显示与隐藏
      setPermissionDialogVisible: false,
      //所有权限
      permissionlist: [],
      //树形控件属性绑定对象
      treeProps: {
        label: "name",
        children: "children",
      },
      //默认选中节点Id的值
      defKeys: [],
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    //添加角色
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        //console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "roles/addrole",
          this.addForm
        );
        if (!res.success) return this.$message.error(res.msg);
        this.$message.success("添加角色成功！");
        //隐藏添加角色的对话框
        this.addDialogVisible = false;
        //重新获取角色列表
        this.getRoleList();
      });
    },
    //监听添加角色对话框的关闭事件
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();
    },
    //编辑角色显示对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`roles/getrole`, {
        params: { rid: id },
      });
      if (!res.success) return this.$message.error(res.msg);
      this.editForm = res.response;
      this.editdialogVisible = true;
    },
    //编辑保存角色
    editRoleInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `roles/updaterole`,
          this.editForm
        );
        if (!res.success) return this.$message.error(res.msg);
        //关闭对话框
        this.editdialogVisible = false;
        //刷新数据列表
        this.getRoleList();
        //提示修改成功
        this.$message.success("更新角色信息成功！");
      });
    },
    //监听修改角色对话框的关闭事件
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    //删除角色
    removeRoleById(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/delete`, {
            params: { rid: id },
          });
          if (!res.success) return this.$message.error(res.msg);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          //刷新角色列表
          this.getRoleList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //获取所有角色的列表
    async getRoleList() {
      const { data: res } = await this.$http.get("roles/get");
      if (!res.success) return this.$message.error(res.msg);
      this.rolelist = res.response.data;
    },
    //根据id删除对应的权限
    removeRightById(role, id) {
      //弹框是否删除
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `permissions/deletermp`,
            { params: { roleid: role.ID, pid: id } }
          );
          if (!res.success) return this.$message.error(res.msg);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          role.children = res.response.data;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //格式化时间
    formatDateTime: function (row, column, cellValue, index) {
      return cellValue.replace("T", " ");
    },
    //展示分配权限对话框
    async showSetPermissionDialog(role) {
      //获取所有的权限列表
      const { data: res } = await this.$http.get("permissions/trees");
      if (!res.success) return this.$message.error(res.msg);
      this.permissionlist = res.response.data;
      //获取三级节点的id
      this.getLeafKeys(role, this.defKeys);
      this.setPermissionDialogVisible = true;
    },
    //通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      //如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    //监听分配权限对话框的关闭事件
    setPermissionDialogClosed() {
      this.defKeys = [];
    },
    //点击为角色分配权限
    allPermission() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      console.log(keys);
    },
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>