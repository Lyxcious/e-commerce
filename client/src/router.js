import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Register from './views/Register.vue'
import Login from './views/Login.vue'
import Cart from './views/Cart.vue'
import Product from './views/Product.vue'
import AddProduct from './views/AddProduct.vue'
import EditProduct from './views/EditProduct.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart,
      beforeEnter (to, from, next) {
        if (localStorage.getItem('access_token')) {
          next()
        } else {
          next({ path: '/login' })
        }
      }
    },
    {
      path: '/product',
      name: 'product',
      component: Product,
      children: [
        {
          name: 'product-add',
          path: 'add',
          component: AddProduct
        },
        {
          name: 'product-edit',
          path: 'edit/:id',
          component: EditProduct
        }
      ]
    }
  ]
})
