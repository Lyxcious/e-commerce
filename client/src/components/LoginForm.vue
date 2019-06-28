<template>
 <form class="form-user center p-3 border border-secondary rounded" id="login-form" @submit.prevent="login">
    <div class="form-group">
      <label>Email address</label>
      <input type="email" class="form-control" v-model="user.email" aria-describedby="emailHelp" placeholder="Email" required>
    </div>
    <div class="form-group">
      <label>Password</label>
      <input type="password" class="form-control" v-model="user.password" placeholder="Password" required>
    </div>
    <div class="form-group">
      <p>Don't have an account? <a href="#" class="register-button" @click="register">Register Here</a></p>
    </div>
    <p>Or login with:</p>
    <div class="row justify-content-center">
      <div class="col-auto">
        <div id="google-signin-button"></div>
      </div>
    </div>
    <div class="col text-center">
      <br>
      <button type="submit" class="btn btn-primary center">Submit</button>
    </div>
  </form>
</template>

<script>
import ax from '../api/server'
export default {
  name: 'LoginForm',
  props: {
  },
  data () {
    return {
      user: {
        email: '',
        password: ''
      },
      userLogin: {
        name: '',
        email: ''
      },
      isLogin: false
    }
  },
  mounted () {
    gapi.signin2.render('google-signin-button', {
      onsuccess: this.onSignIn
    })
  },
  methods: {
    register () {
      this.$router.push({ path: '/register' })
    },
    login () {
      ax({
        method: 'post',
        url: '/user/login',
        data: this.user
      })
        .then(({ data }) => {
          this.userLogin.name = data.name
          this.userLogin.email = data.email
          this.isLogin = true
          this.$emit('loginData', this.userLogin, this.isLogin)
          localStorage.setItem('token', data.access_token)
          localStorage.setItem('name', data.name)
          localStorage.setItem('email', data.email)
          this.$swal({
            type: 'success',
            title: 'Login Success!',
            text: 'Welcome to LovelyCart',
            showConfirmButton: false,
            timer: 3000
          })
          ax({
            method: 'post',
            url: 'cart/create',
            headers: { access_token: data.access_token }
          })
            .then(({ data }) => {
              localStorage.setItem('cart', data._id)
              this.$router.push({ path: '/' })
            })
            .catch(err => {
              console.log(err)
              if (err.response) {
                ax({
                  method: 'get',
                  url: 'cart/detail',
                  headers: { access_token: localStorage.getItem('token') }
                })
                  .then(({ data }) => {
                    localStorage.setItem('cart', data._id)
                    this.$router.push({ path: '/' })
                  })
                  .catch(err => {
                    console.log(err)
                  })
              }
            })
        })
        .catch(err => {
          this.$swal({
            type: 'error',
            title: `${err.response.data.message}`,
            showConfirmButton: true
          })
        })
    },
    onSignIn (googleUser) {
      if (!localStorage.getItem('token')) {
        var idToken = googleUser.getAuthResponse().id_token
        let token = idToken
        ax({
          method: 'post',
          url: '/user/signingoogle',
          data: { token }
        })
          .then(({ data }) => {
            console.log('masuk login google')
            this.userLogin.name = data.name
            this.userLogin.email = data.email
            this.isLogin = true
            this.$emit('loginData', this.userLogin, this.isLogin)
            localStorage.setItem('token', data.access_token)
            localStorage.setItem('name', data.name)
            localStorage.setItem('email', data.email)
            this.$swal({
              type: 'success',
              title: 'Login Success!',
              text: 'Welcome to LovelyCart',
              showConfirmButton: false,
              timer: 3000
            })
            ax({
              method: 'post',
              url: 'cart/create',
              headers: { access_token: data.access_token }
            })
              .then(({ data }) => {
                localStorage.setItem('cart', data._id)
                this.$router.push({ path: '/' })
              })
              .catch(err => {
                console.log(err)
                if (err.response) {
                  ax({
                    method: 'get',
                    url: 'cart/detail',
                    headers: { access_token: localStorage.getItem('token') }
                  })
                    .then(({ data }) => {
                      localStorage.setItem('cart', data._id)
                      this.$router.push({ path: '/' })
                    })
                    .catch(err => {
                      console.log(err)
                    })
                }
              })
          })
          .catch((err) => {
            this.$swal({
              type: 'error',
              title: `${err.response.data.message}`,
              showConfirmButton: true
            })
          })
      }
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
