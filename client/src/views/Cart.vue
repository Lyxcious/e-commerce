<template>
  <div class="cart d-flex flex-column justify-content-between">
    <CartList style="overflow-y: scroll" :cart="carts" @updateCart="updateCart"/>
    <div>
      <hr/>
      <b-button variant="success" @click="checkOut">Check Out</b-button>
    </div>
  </div>
</template>

<script>
import ax from '../api/server'
import CartList from '../components/CartList'
export default {
  props: {
    cart: Array
  },
  components: {
    CartList
  },
  data () {
    return {
      carts: {
        products: [],
        quantity: [],
        totalPrice: []
      },
      totalSpent: 0
    }
  },
  created () {
    for (let i in this.cart) {
      this.carts.quantity.push(0)
      this.carts.totalPrice.push(0)
      ax({
        method: 'get',
        url: `/product/detail/${this.cart[i]}`,
        headers: { access_token: localStorage.getItem('token') }
      })
        .then(({ data }) => {
          this.carts.products.push(data)
        })
        .catch(err => {
          this.$swal({
            type: 'error',
            title: `${err.response.data.message}`,
            showConfirmButton: true
          })
        })
    }
  },
  methods: {
    updateCart (cart) {
      this.carts = cart
      let productIds = []
      for (let i in cart.products) {
        productIds.push(cart.products[i]._id)
      }
      this.$emit('updateCart', productIds)
    },
    formating (num) {
      num = String(num)
      let output1 = ''
      let count = 0
      for (let i = num.length - 1; i >= 0; i--) {
        count++
        if (count === 3 && i !== 0) {
          output1 += num[i] + '.'
          count = 0
        } else {
          output1 += num[i]
        }
      }
      let output2 = ''
      for (let i = output1.length - 1; i >= 0; i--) {
        output2 += output1[i]
      }
      return output2 + ',00'
    },
    checkOut () {
      for (let i in this.carts.totalPrice) {
        this.totalSpent += this.carts.totalPrice[i]
      }
      this.$swal({
        type: 'success',
        title: 'Thank You for Your Purchase',
        text: `You spent: Rp ${this.formating(this.totalSpent)}`,
        showConfirmButton: true
      })
    }
  }
}
</script>

<style scoped>
  .cart {
    padding: 15px 45px;
  }
</style>
