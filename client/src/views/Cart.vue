<template>
  <div class="cart d-flex flex-column justify-content-between">
    <CartList style="overflow-y: scroll" :cart="carts"/>
    <div>
      <hr/>
      <b-button href="/" variant="success" @click="checkOut">Check Out</b-button>
    </div>
  </div>
</template>

<script>
import ax from '../api/server'
import CartList from '../components/CartList'
export default {
  props: {
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
    ax({
      method: 'get',
      url: `/cart/detail`,
      headers: { access_token: localStorage.getItem('token') }
    })
      .then(({ data }) => {
        this.carts.products = data.products
        this.carts.quantity = data.quantity
        data.products.forEach(() => {
          this.carts.totalPrice.push(0)
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
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
      if (this.totalSpent !== 0) {
        this.$swal({
          type: 'success',
          title: 'Thank You for Your Purchase',
          text: `You spent: Rp ${this.formating(this.totalSpent)}`,
          showConfirmButton: true
        })
        let productId = []
        this.carts.products.forEach(product => {
          productId.push(product._id)
        })
        ax({
          method: 'patch',
          url: `cart/checkout/${localStorage.getItem('cart')}`,
          data: {
            products: productId,
            quantity: this.carts.quantity
          },
          headers: { access_token: localStorage.getItem('token') }
        })
          .then(({ data }) => {
            localStorage.removeItem('cart')
            return ax({
              method: 'post',
              url: 'cart/create',
              headers: { access_token: data.access_token }
            })
          })
          .then(data => {
            localStorage.setItem('cart', data._id)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
}
</script>

<style scoped>
  .cart {
    padding: 15px 45px;
  }
</style>
