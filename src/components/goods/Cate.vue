<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!--表格区域-->
      <tree-table
        class="treeTable"
        show-index
        index-text="#"
        :selection-type="false"
        border
        stripe
        :show-row-hover="false"
        :expand-type="false"
        :data="catelist"
        :columns="columns"
      >
        <!--是否有效-->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_IsDelete === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!--排序-->
        <template slot="order" slot-scope="scope">
          <el-tag size="min" v-if="scope.row.cat_Level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="min"
            v-else-if="scope.row.cat_Level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="min" v-else>三级</el-tag>
        </template>
        <!--操作-->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="min" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button type="danger" size="min" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--添加分类对话框-->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!--添加分类表单-->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_Name">
          <el-input v-model="addCateForm.cat_Name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              checkStrictly: true,
              value: 'cat_ID',
              label: 'cat_Name',
              children: 'children',
            }"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>
<script>
export default {
  data() {
    return {
      //查询条件
      queryInfo: {
        type: 0,
        pagenum: 1,
        pagesize: 3,
      },
      //商品分类的数据列表，默认为空
      catelist: [],
      //总条数
      total: 0,
      //为table指定列
      columns: [
        {
          label: "分类名称",
          prop: "cat_Name",
        },
        {
          label: "是否有效",
          //表示，将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "isok",
        },
        {
          label: "排序",
          //表示，将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "order",
        },
        {
          label: "操作",
          //表示，将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "opt",
        },
      ],
      //控制添加分类对话框显示与隐藏
      addCateDialogVisible: false,
      //添加分类表单对象
      addCateForm: {
        //将要添加的分类名称
        cat_Name: "",
        //父级分类的id
        cat_Pid: 0,
        //分类等级 默认添加的是一级分类
        cat_Level: 0,
      },
      //添加分类对象验证规则
      addCateFormRules: {
        cat_Name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //父级分类数组
      parentCateList: [],
      //指定级联器配置对象
      cascaderProps: {
        value: "cat_ID",
        label: "cat_Name",
        children: "children",
      },
      //选中父级id数组
      selectedKeys: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get(`categories/categories`, {
        params: this.queryInfo,
      });
      if (!res.success) return this.$message.error(res.msg);
      this.catelist = res.response.data;
      this.total = res.response.dataCount;
    },
    //监听pagesize改变
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getCateList();
    },
    //监听pagenum改变
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getCateList();
    },
    //点击按钮显示添加分类对话框
    showAddCateDialog() {
      //先获取父级分类列表然后展示对话框
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    //获取父级分类数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get(`categories/parentcates`);
      if (!res.success) return this.$message.error(res.msg);
      this.parentCateList = res.response;
    },
    //选择项发生变化触发这个函数
    parentCateChanged() {
      //如果selectedKeys数组中的length 大于0，证明选中的父级分类
      //反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        //父级分类的id
        this.addCateForm.cat_Pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        //为当前分类的等级赋值
        this.addCateForm.cat_Level = this.selectedKeys.length;
        return;
      } else {
        //父级分类的id
        this.addCateForm.cat_Pid = 0;
        //为当前分类的等级赋值
        this.addCateForm.cat_Level = 0;
      }
    },
    //添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/addcate`,
          this.addCateForm
        );
        if (!res.success) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    //监听添加分类对话框关闭事件,重置表单
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_Level = 0;
      this.addCateForm.cat_Pid = 0;
    },
  },
};
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>