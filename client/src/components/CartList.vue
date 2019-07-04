<template>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">No</th>
        <th scope="col">Product Name</th>
        <th scope="col">Price</th>
        <th scope="col"></th>
        <th scope="col">Quantity</th>
        <th scope="col"></th>
        <th scope="col">Total</th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
      <ProductCart v-for="(product, index) in cart.products" :index="index" :key="product._id" @updateCart="updateCart" :product="product" :quantity="carts.quantity[index]" :totalPrice="carts.totalPrice[index]" @removeCart="removeCart"/>
    </tbody>
  </table>
</template>

<script>
import ax from '@/api/server.js'
import ProductCart from './ProductCart'
export default {
  components: {
    ProductCart
  },
  props: {
    cart: Object
  },
  data () {
    return {
      carts: {
        products: [],
        quantity: [],
        totalPrice: []
      }
    }
  },
  created () {
    this.carts = this.cart
  },
  methods: {
    updateCart (cart, i) {
      this.carts.products[i] = cart.product
      this.carts.quantity[i] = cart.quantity
      this.carts.totalPrice[i] = cart.totalPrice
      let productId = []
      this.carts.products.forEach(product => {
        productId.push(product._id)
      })
      ax({
        method: 'patch',
        url: `/cart/update/${localStorage.getItem('cart')}`,
        data: {
          products: productId,
          quantity: this.carts.quantity
        },
        headers: { access_token: localStorage.getItem('token') }
      })
        .then(({ data }) => {
          console.log('update cart')
        })
        .catch(err => {
          console.log(err)
        })
    },
    removeCart (i) {
      this.carts.products.splice(i, 1)
      this.carts.quantity.splice(i, 1)
      this.carts.totalPrice.splice(i, 1)
      let productId = []
      this.carts.products.forEach(product => {
        productId.push(product._id)
      })
      ax({
        method: 'patch',
        url: `/cart/update/${localStorage.getItem('cart')}`,
        data: {
          products: productId,
          quantity: this.carts.quantity
        },
        headers: { access_token: localStorage.getItem('token') }
      })
        .then(({ data }) => {
          console.log('update cart')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style>

</style>
