<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--警告区域-->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!--选择商品分类区域-->
      <el-row class="cat_opt"
        ><el-col>
          <span>选择商品分类：</span>
          <!--选择商品分类的级联选择框-->
          <el-cascader
            v-model="selectedCateKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              checkStrictly: true,
              value: 'cat_ID',
              label: 'cat_Name',
              children: 'children',
            }"
            @change="handleChange"
          ></el-cascader> </el-col
      ></el-row>
      <!--tab页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!--添加动态参数的面板-->
        <el-tab-pane label="动态参数" name="many">
          <!--添加参数按钮-->
          <el-button
            type="primary"
            size="mini"
            @click="addDialogVisible = true"
            :disabled="isBtnDisabled"
            >添加参数</el-button
          >
          <!--动态参数表格-->
          <el-table :data="manyTableData" border stripe>
            <!--展开行-->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <!--循环渲染tag标签-->
                    <el-tag @close="handleClose(i,scope.row)" closable v-for="(item,i) in scope.row.attr_Vals" :key="i">{{item}}</el-tag>
                    <!--输入文本框-->
                    <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<!--添加按钮-->
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_Name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_ID)"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_ID)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--添加静态属性的面板-->
        <el-tab-pane label="静态属性" name="only">
          <!--添加属性按钮-->
          <el-button
            type="primary"
            @click="addDialogVisible = true"
            size="mini"
            :disabled="isBtnDisabled"
            >添加属性</el-button
          >
          <!--静态属性表格-->
          <el-table :data="onlyTableData" border stripe>
            <!--展开行-->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <!--循环渲染tag标签-->
                    <el-tag @close="handleClose(i,scope.row)" closable v-for="(item,i) in scope.row.attr_Vals" :key="i">{{item}}</el-tag>
                    <!--输入文本框-->
                    <el-input
  class="input-new-tag"
  v-if="scope.row.inputVisible"
  v-model="scope.row.inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm(scope.row)"
  @blur="handleInputConfirm(scope.row)"
>
</el-input>
<!--添加按钮-->
<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_Name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_ID)"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_ID)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--添加参数对话框-->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_Name">
          <el-input v-model="addForm.attr_Name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改参数对话框-->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_Name">
          <el-input v-model="editForm.attr_Name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 商品分类列表
      parentCateList: [],
      // 级联选择项
      selectedCateKeys: [],
      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数和添加动态属性对象
      addForm: {},
      // 添加参数的表单验证规则对象
      addFormRules: {
        attr_Name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制编辑对话框显示与隐藏
      editDialogVisible: false,
      // 编辑表单对象
      editForm: {},
      // 编辑参数表单验证规则对象
      editFormRules: {
        attr_Name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories/parentcates')
      if (!res.success) return this.$message.error(res.msg)
      this.parentCateList = res.response
    },
    // 级联选择框变化会触发这个函数
    handleChange () {
      this.getParamsData()
    },
    // tab 页签点击事件的处理函数
    handleClick () {
      this.getParamsData()
    },
    // 获取参数的列表数据、
    async getParamsData () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 根据所选分类的id,和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get('cateparams/paramlist', {
        params: { attr_Sel: this.activeName, cat_ID: this.cateId }
      })
      if (!res.success) return this.$message.error(res.msg)
      // 字符串转数组
      res.response.forEach(item => {
        item.attr_Vals = item.attr_Vals ? item.attr_Vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.response
      } else {
        this.onlyTableData = res.response
      }
    },
    // 监听对话框关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加事件
    addParams () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        this.addForm.cat_ID = this.cateId
        this.addForm.attr_Sel = this.activeName
        const { data: res } = await this.$http.post(
          'cateparams/addcateparam',
          this.addForm
        )
        if (!res.success) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.addDialogVisible = false
        // 刷新数据列表
        this.getParamsData()
      })
    },
    // 编辑参数事件
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('cateparams/cateparam', {
        params: { id: id }
      })
      if (!res.success) return this.$message.error(res.msg)
      this.editForm = res.response
      this.editDialogVisible = true
    },
    // 监听编辑参数对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮修改参数信息
    editParams () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        this.editForm.attr_Sel = this.activeName
        this.editForm.cat_ID = this.cateId
        const { data: res } = await this.$http.put(
          'cateparams/updatecateparam',
          this.editForm
        )
        if (!res.success) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 点击删除按钮事件
    removeParams (id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('cateparams/deletecateparam', { params: { id: id } })
        if (!res.success) this.$message.error(res.msg)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getParamsData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 文本框失去焦点，或者按下了enter都会触发
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return,则证明输入的内容，需要做后续处理
      row.attr_Vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 需要发起请求，保存这次操作
      const newrow = Object.assign({}, row)
      this.saveAttrVals(newrow)
    },
    // 点击按钮，展示文本输入框
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick方法的作用，就是当页面上元素被重新渲染之后，才会
      // 指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 将对attr_Vals的操作保存到数据库
    async saveAttrVals (newrow) {
      newrow.attr_Vals = newrow.attr_Vals.join(' ')
      const { data: res } = await this.$http.put(
        'cateparams/updatecateparam',
        newrow
      )
      if (!res.success) return this.$message.error(res.msg)
      this.$message.success(res.msg)
    },
    // 删除对应的参数可选项
    handleClose (i, row) {
      row.attr_Vals.splice(i, 1)
      const newrow = Object.assign({}, row)
      this.saveAttrVals(newrow)
    }
  },
  computed: {
    // 如果按钮需要被禁用，则返回true,否则返回false
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题的文本
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag{
    margin: 10px;
}
.input-new-tag{
    width: 120px;
}
</style>
