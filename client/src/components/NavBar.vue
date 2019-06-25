<template>
  <div id="nav">
      <b-navbar variant="faded" type="light">
        <b-navbar-brand tabs href="#" md="auto" class="col-2 brand">
          <img src="../assets/logo.png" class="d-inline-block align-top" alt="Logo" width="30" height="30">
          LovelyCart
        </b-navbar-brand>
        <b-nav tabs align="center" class="col" md="auto">
          <b-nav-item :to="{ path: '/'}" :active='$route.name =="home"'>Home</b-nav-item>
          <b-nav-item :to="{ path: '/cart'}" :active='$route.name =="cart"' v-if="user.email != 'admin@admin.com'">Cart</b-nav-item>
          <b-nav-item :to="{ path: '/product'}" :active='$route.name =="product"' v-else-if="user.email == 'admin@admin.com'">Product</b-nav-item>
          <b-nav-item disabled :active='$route.name =="detail"' v-if="user.email != 'admin@admin.com'">Detail Product</b-nav-item>
        </b-nav>
        <b-nav tabs align="end" class="col-2" md="auto">
          <b-nav-item :to="{ path: '/register'}" v-if="isLogin == false">Register</b-nav-item>
          <b-nav-item :to="{ path: '/login'}" v-if="isLogin == false">Login</b-nav-item>
          <b-nav-item disable v-if="isLogin == true">{{user.name}}</b-nav-item>
          <b-nav-item :to="{ path: '/login'}" v-if="isLogin == true">Logout</b-nav-item>
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
</style>
