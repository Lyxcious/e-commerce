<template>
  <div id="app" class="d-flex flex-column justify-content-between">
    <div>
      <NavBar :isLogin='isLogin' :user="userLogin" @logout="logout"/>
      <NavBarProduct :product="product" v-if="userLogin.email == 'admin@admin.com' && ($route.name == 'product-edit' || $route.name == 'product-add' || $route.name == 'product')"/>
    </div>
    <router-view class="flex-grow-1" @loginData="loginData" :isLogin="isLogin" :user="userLogin" @addToCart="addToCart" @updateCart="updateCart" @emptyCart="emptyCart"/>
    <Footer/>
  </div>
</template>

<script>
import NavBar from './components/NavBar'
import NavBarProduct from './components/NavBarProduct'
import Footer from './components/Footer'
import ax from './api/server'
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
      cartProduct: [],
      cartProductQ: []
    }
  },
  mounted () {
    this.checkLogin()
    if (localStorage.getItem('token')) {
      ax({
        method: 'get',
        url: 'cart/detail',
        headers: { access_token: localStorage.getItem('token') }
      })
        .then(({ data }) => {
          localStorage.setItem('cart', data._id)
          this.cartProduct = []
          this.cartProductQ = []
          for (let i in data.products) {
            this.cartProduct.push(data.products[i]._id)
            this.cartProductQ.push(data.quantity[i])
          }
        })
        .catch(err => {
          if (err.response) {
            ax({
              method: 'post',
              url: 'cart/create',
              headers: { access_token: localStorage.getItem('token') }
            })
              .then(({ data }) => {
                localStorage.setItem('cart', data._id)
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
    }
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
    },
    addToCart (id) {
      let found = false
      for (let i in this.cartProduct) {
        if (this.cartProduct[i] === id) {
          found = true
        }
      }
      if (!found) {
        this.cartProduct.push(id)
        this.cartProductQ.push(0)
        console.log({
          products: [...this.cartProduct],
          quantity: [...this.cartProductQ]
        })
        ax({
          method: 'patch',
          url: `cart/update/${localStorage.getItem('cart')}`,
          data: {
            products: [...this.cartProduct],
            quantity: [...this.cartProductQ]
          },
          headers: { access_token: localStorage.getItem('token') }
        })
          .then(({ data }) => {
            console.log(data)
            localStorage.setItem('cart', data._id)
            this.cartProduct = []
            for (let i in data.products) {
              this.cartProduct.push(data.products[i])
            }
            console.log(this.cartProduct)
            this.$swal({
              type: 'success',
              title: 'Product added to Cart!',
              showConfirmButton: false,
              timer: 3000
            })
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$swal({
          type: 'error',
          title: 'Product already at Cart!',
          showConfirmButton: false,
          timer: 3000
        })
      }
    },
    updateCart (productIds) {
      this.cart = productIds
    },
    emptyCart () {
      this.cartProduct = []
      this.cartProductQ = []
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
