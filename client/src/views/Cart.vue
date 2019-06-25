<template>
  <div class="cart d-flex flex-column justify-content-between">
    <CartList style="overflow-y: scroll"/>
    <div>
      <hr/>
      <b-button variant="success">Check Out</b-button>
    </div>
  </div>
</template>

<script>
import CartList from '../components/CartList'
export default {
  props: {
    isLogin: String
  },
  components: {
    CartList
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.isLogin) {
        next()
      }
    })
  }
}
</script>

<style scoped>
  .cart {
    padding: 15px 45px;
  }
</style>
