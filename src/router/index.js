import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../views/Home.vue')
const Category = () => import('../views/Category.vue')
const Cart = () => import('../views/cart/Cart.vue')
const Profile = () => import('../views/Profile.vue')
const Detail = () => import('../views/detail/Detail.vue')

//处理重复路由报错
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err);
};

//1.安装插件
Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: '',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta:{
      title:'首页'
    }
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta:{
      title:'分类'
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta:{
      title:'购物车'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta:{
      title:'我的'
    }
  },
  {
    path: '/detail/:iid',
    name: 'Detail',
    component: Detail,
    meta:{
      title:'商品详情页'
    }
  },
]
//2.创建router
const router = new VueRouter({
  routes,
  mode: 'history'
})

//3.前置守卫
router.beforeEach((to,from,next) => {
  // 从from跳到to，to就是上面的meta对象
  document.title = to.matched[0].meta.title
  next()  //必须调用next函数
})
export default router