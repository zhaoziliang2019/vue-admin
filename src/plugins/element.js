import Vue from 'vue'
import { Button, Form, FormItem, Input,Message,Container,Header,Aside,Main,
Menu,Submenu,MenuItemGroup,MenuItem
} from 'element-ui'

// 导入弹框提示组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
// 挂载
Vue.prototype.$message = Message
