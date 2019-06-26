<template>
  <div id="app" class="d-flex flex-column justify-content-between">
    <div>
      <NavBar :isLogin='isLogin' :user="userLogin" @logout="logout"/>
      <NavBarProduct :product="product" v-if="userLogin.email == 'admin@admin.com' && ($route.name == 'product-edit' || $route.name == 'product-add' || $route.name == 'product')"/>
    </div>
    <router-view class="flex-grow-1" @loginData="loginData" :isLogin="isLogin" :user="userLogin"/>
    <Footer/>
  </div>
</template>

<script>
import NavBar from './components/NavBar'
import NavBarProduct from './components/NavBarProduct'
import Footer from './components/Footer'
export default {
  components: {
    NavBar,
    NavBarProduct,
    Footer
  },
  data () {
    return {
      userLogin: {
        name: '',
        email: ''
      },
      isLogin: false,
      product: {
        id: '',
        image: '',
        imageSend: '',
        name: '',
        desc: '',
        price: '',
        stock: ''
      },
      mainPage: 'product',
      cart: []
    }
  },
  mounted () {
    this.checkLogin()
  },
  methods: {
    checkLogin () {
      if (localStorage.getItem('token')) {
        this.userLogin.name = localStorage.getItem('name')
        this.userLogin.email = localStorage.getItem('email')
        this.isLogin = true
      }
    },
    loginData (user, isLogin) {
      this.userLogin = user
      this.isLogin = isLogin
    },
    logout (user, isLogin) {
      this.userLogin = user
      this.isLogin = isLogin
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
