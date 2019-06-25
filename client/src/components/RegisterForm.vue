<template>
  <form class="form-user center border border-secondary p-3 rounded" @submit.prevent="register">
    <div class="form-group">
      <label>Name</label>
      <input type="text" class="form-control" v-model="newUser.name" placeholder="Enter name" required>
    </div>
    <div class="form-group">
      <label>Email address</label>
      <input type="email" class="form-control" v-model="newUser.email" aria-describedby="emailHelp" placeholder="Enter email" required>
    </div>
    <div class="form-group">
      <label>Password</label>
      <input type="password" class="form-control" v-model="newUser.password" placeholder="Password" required>
    </div>
    <div class="form-group">
      <p>Already have an account? <a href="#" class="login-button" @click="login">Login Here</a></p>
    </div>
    <div class="col text-center">
      <button type="submit" class="btn btn-primary center">Submit</button>
    </div>
  </form>
</template>

<script>
import ax from '../api/server'
export default {
  name: 'RegisterForm',
  props: {
  },
  data () {
    return {
      newUser: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      this.$router.push({ path: '/login' })
    },
    register () {
      ax({
        method: 'post',
        url: '/user/register',
        data: this.newUser
      })
        .then(({ data }) => {
          console.log('masuk register')
          this.$swal({
            type: 'success',
            title: 'Register Success',
            showConfirmButton: false,
            timer: 3000
          })
          this.$router.push({ path: '/login' })
        })
        .catch(err => {
          console.log(err.response)
          this.$swal({
            type: 'error',
            title: `${err.response.data.message}`,
            showConfirmButton: true
          })
        })
    }
  }
}
</script>

<style scoped>
  .form-user {
    width: 40%;
    border-color: grey;
    border-width: 2px !important;
    -webkit-box-shadow: 10px 10px 11px -3px rgba(107,107,107,1);
    -moz-box-shadow: 10px 10px 11px -3px rgba(107,107,107,1);
    box-shadow: 10px 10px 11px -3px rgba(107,107,107,1);
  }
  .center {
    margin: 0px auto;
  }
</style>
