<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!--步骤条区域-->
      <!--字符串转数字减去0-->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--tab栏区域-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_Name">
              <el-input v-model="addForm.goods_Name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_Price">
              <el-input type="number" v-model="addForm.goods_Price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_Weight">
              <el-input type="number" v-model="addForm.goods_Weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_Number">
              <el-input type="number" v-model="addForm.goods_Number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_Cat">
              <el-cascader
                v-model="addForm.goods_Cat"
                :options="catelist"
                :props="{
                  expandTrigger: 'hover',
                  checkStrictly: true,
                  value: 'cat_ID',
                  label: 'cat_Name',
                  children: 'children',
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_Name"
              v-for="item in manyTableData"
              :key="item.attr_ID"
            >
              <el-checkbox-group v-model="item.attr_Vals">
                <el-checkbox
                  border
                  :label="cb"
                  v-for="(cb, i) in item.attr_Vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_Name"
              v-for="item in onlyTableData"
              :key="item.attr_ID"
            >
              <el-input v-model="item.attr_Vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--富文本编辑组件-->
            <quill-editor v-model="addForm.goods_Introduce"></quill-editor>
            <!--添加商品的按钮-->
            <el-button type="primary" class="btnAdd" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!--图片预览-->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_Name: '',
        goods_Price: 0,
        goods_Weight: 0,
        goods_Number: 0,
        // 商品所属的分类数组
        goods_Cat: [],
        // 图片数组
        goods_Pics: [],
        // 商品介绍
        goods_Introduce: '',
        // 参数列表
        goods_Attrs: []
      },
      // 表单验证规则对象
      addFormRules: {
        goods_Name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_Price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_Weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_Number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_Cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类列表
      catelist: [],
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 上传图片的地址
      uploadURl: 'http://localhost:5000/api/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 控制图片预览对话框的显示与隐藏
      previewVisible: false,
      // 图片预览显示的路径
      previewPath: ''

    }
  },
  // 生命周期函数
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories/parentcates')
      if (!res.success) return this.$message.error(res.msg)
      this.catelist = res.response
    },
    // 级联选择器改变事件
    handleChange () {
      if (this.addForm.goods_Cat.length !== 3) {
        this.addForm.goods_Cat = []
      }
    },
    // tab切换事件
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_Cat.length !== 3) {
        this.$message.error('请选择商品分类！')
        return false
      }
    },
    // tab点击事件
    async tabClicked () {
      // 访问的是动态参数面板
      if (this.activeIndex === '1') {
        // 根据所选分类的id,和当前所处的面板，获取对应的参数
        const { data: res } = await this.$http.get('cateparams/paramlist', {
          params: { attr_Sel: 'many', cat_ID: this.cateId }
        })
        if (!res.success) return this.$message.error(res.msg)
        // 字符串转数组
        res.response.forEach((item) => {
          item.attr_Vals = item.attr_Vals ? item.attr_Vals.split(' ') : []
        })
        this.manyTableData = res.response
      } // 静态属性页
      else if (this.activeIndex === '2') {
        // 根据所选分类的id,和当前所处的面板，获取对应的参数
        const { data: res } = await this.$http.get('cateparams/paramlist', {
          params: { attr_Sel: 'only', cat_ID: this.cateId }
        })
        if (!res.success) return this.$message.error(res.msg)
        this.onlyTableData = res.response
      }
    },
    // 上传图片预览
    handlePreview (file) {
      this.previewPath = this.uploadURl + file.response.response
      console.log(this.previewPath)
      this.previewVisible = true
    },
    // 图片移除事件
    handleRemove (file) {
      // 1.获取将要删除的文件的临时路径
      const filePath = file.response.response
      // 2.从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.goods_Pics.findIndex(
        (x) => x === filePath
      )
      // 3.调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.addForm.goods_Pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 监听文件上传成功事件
    handleSuccess (response) {
      // 1.拼接得到一个图片信息对象
      // 2.将图片信息对象，push到pics数组中
      this.addForm.goods_Pics.push(response.response)
    },
    // 添加商品
    addGoods () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        // 执行添加的业务处理
        // lodash cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_Cat = form.goods_Cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          this.addForm.goods_Attrs.push(item.attr_ID)
        })
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          this.addForm.goods_Attrs.push(item.attr_ID)
        })
        form.goods_Attrs = this.addForm.goods_Attrs.join(',')
        form.goods_Pics = this.addForm.goods_Pics.join(',')
        // 发起请求添加商品
        // 商品名称必须是唯一的
        const { data: res } = await this.$http.post('goodslists/addgood', form)
        if (!res.success) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        // 跳转到商品页
        this.$router.push('/goodslists')
      })
    }
  },
  computed: {
    // 当前选中的三级分类的id
    cateId () {
      if (this.addForm.goods_Cat.length === 3) {
        return this.addForm.goods_Cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
