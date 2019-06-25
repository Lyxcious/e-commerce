<template>
  <div id='login' class="container login">
    <h2 class="text-center mb-3 mt-4">Login Form</h2>
    <LoginForm @loginData="loginData"/>
  </div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue'
export default {
  components: {
    LoginForm
  },
  methods: {
    loginData (user, isLogin) {
      this.$emit('loginData', user, isLogin)
    }
  }
}
</script>
