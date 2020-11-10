<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.key"
            clearable
            @clear="getPermissionList"
          >
            <el-button
              @click="getPermissionList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加权限</el-button>
        </el-col>
      </el-row>
      <!--权限列表区域-->
      <el-table
        :data="permissionlist"
        border
        stripe
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="name" label="权限名"></el-table-column>
      <el-table-column prop="pCreateBy" label="创建人"></el-table-column>
      <el-table-column prop="pModifyBy" label="创建时间"></el-table-column>
      <el-table-column prop="pName" label="修改人"></el-table-column>
      <el-table-column prop="pName" label="修改时间"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.pID)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeMenuById(scope.row.pID)"
              >删除</el-button
            >
          </template>
      </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 搜索内容
      queryInfo: {
        key: ''
      },
      // 权限列表
      permissionlist: []
    }
  },
  created () {
    // 获取权限列表
    this.getPermissionList()
  },
  methods: {
    // 添加权限对话框
    showAddDialog () {},
    // 获取所有的权限列表
    async getPermissionList () {
      const { data: res } = await this.$http.get('permissions/trees', {
        params: { key: this.queryInfo.key }
      })
      if (!res.success) return this.$message.error(res.msg)
      this.permissionlist = res.response.data
    }
  }
}
</script>
<style lang="less" scoped>
</style>
