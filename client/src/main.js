import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

Vue.config.productionTip = false

Vue.use(Swal)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
