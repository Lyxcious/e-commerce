<template>
  <div id="app" class="d-flex flex-column justify-content-between">
    <div>
      <NavBar :isLogin='isLogin' :user="user"/>
      <NavBarProduct :product="product" :page="page" v-if="mainPage == 'product'"/>
    </div>
    <router-view class="flex-grow-1" />
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
      user: {
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
      page: 'edit'
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
