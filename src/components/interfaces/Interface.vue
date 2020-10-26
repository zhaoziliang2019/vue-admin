<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>接口管理</el-breadcrumb-item>
      <el-breadcrumb-item>接口列表</el-breadcrumb-item>
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
            @clear="getInterfaceList"
          >
            <el-button
              @click="getInterfaceList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加接口</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="interfaceList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="接口地址" prop="iLinkUrl"></el-table-column>
        <el-table-column label="描述" prop="iDescription"></el-table-column>
        <el-table-column label="创建者" prop="iCreateBy"></el-table-column>
        <el-table-column label="创建时间" prop="iCreateTime"></el-table-column>
        <el-table-column label="状态" prop="iEnabled">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.iEnabled==true">激活</el-tag>
                <el-tag type="danger" v-else>禁用</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //获取用户列表参数对象
      queryInfo: {
        key: "",
        //当前的页数
        page: 1,
        pagesize: 10,
      },
      //接口列表
      interfaceList: [],
    };
  },
  created() {
    //获取所有的接口信息
    this.getInterfaceList();
  },
  methods: {
    //获取接口列表
    async getInterfaceList() {
      const { data: res } = await this.$http.get("interfaces/get", {
        params: this.queryInfo,
      });
      if (!res.success) return this.$message.error(res.msg);
      this.interfaceList = res.response.data;
      console.log(res);
    },
  },
};
</script>
<style lang="less" scoped>
</style>