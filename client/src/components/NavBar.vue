<template>
  <div id="nav">
      <b-navbar variant="faded" type="light">
        <b-navbar-brand tabs href="#" md="auto" class="col-2 brand">
          <img src="../assets/logo.png" class="d-inline-block align-top" alt="Logo" width="30" height="30">
          LovelyCart
        </b-navbar-brand>
        <b-nav tabs align="center" class="col" md="auto">
          <b-nav-item :to="{ path: '/'}" :active='$route.name =="home"' ><i class="fas fa-home"></i> Home</b-nav-item>
          <b-nav-item :to="{ path: '/cart'}" :active='$route.name =="cart"' v-if="user.email != 'admin@admin.com'"><i class="fas fa-shopping-cart"></i> Cart</b-nav-item>
          <b-nav-item :to="{ path: '/product/add'}" :active='$route.name =="product" || $route.name == "product-add" || $route.name == "product-edit"' v-else>Product</b-nav-item>
        </b-nav>
        <b-nav tabs align="end" class="col-2" md="auto">
          <b-nav-item :to="{ path: '/register'}" v-if="isLogin == false">Register</b-nav-item>
          <b-nav-item :to="{ path: '/login'}" v-if="isLogin == false">Login</b-nav-item>
          <b-nav-item disable v-if="isLogin == true">{{user.name}}</b-nav-item>
          <b-nav-item v-if="isLogin == true"><a href="/login"  @click="logout" class="disableHover">Logout</a></b-nav-item>
        </b-nav>
      </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    'isLogin': Boolean,
    'user': Object
  },
  data () {
    return {
      resetUser: {
        name: '',
        email: ''
      },
      login: false
    }
  },
  methods: {
    logout () {
      localStorage.clear()
      this.$swal({
        type: 'success',
        title: 'Logout Success! See you soon',
        showConfirmButton: false,
        timer: 3000
      })
      setTimeout(() => {
        gapi.load('auth2', function () {
          console.log('ready to use auth2')
          var auth2 = gapi.auth2.getAuthInstance()
          auth2.signOut().then(function () {
            console.log('User signed out.')
          })
        })
        this.$emit('logout', this.resetUser, this.login)
      }, 1000)
    }
  }
}
</script>

<style scoped>
  #nav {
    padding-bottom: 0;
    padding-top: 5px;
  }
  .brand {
    margin: 0;
    text-align: start;
    border-bottom: 1px solid rgb(222, 226, 230);
  }
  .disableHover:hover {
    text-decoration: none;
  }
</style>
