<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <!--<img src="../assets/head.png" alt="" />-->
        <span>权限后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--菜单区域-->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!--一级菜单-->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!--一级菜单的模板区域-->
            <template slot="title">
              <!--图标-->
              <i :class="item.iconCls"></i>
              <!--文本-->
              <span>{{ item.name }}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item
              :index="subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id" @click="saveNavState(subitem.path)"
            >
              <template slot="title">
                <!--图标-->
                <i :class="subitem.iconCls"></i>
                <!--文本-->
                <span>{{ subitem.name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu></el-aside
      >
      <el-main
        ><!--路由占位符-->
        <router-view></router-view
      ></el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menulist: [],
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('/menus/get')
      // console.log(res);
      if (!res.success) return this.$message.error(res.msg)
      this.menulist = res.response.children
    },
    // 点击按钮，切换菜单折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
