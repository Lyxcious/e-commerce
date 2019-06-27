<template>
  <tr>
    <th scope="row">{{index + 1}}</th>
    <td>{{product.name}}</td>
    <td>Rp {{formating(product.price)}}</td>
    <td><button type="button" class="btn btn-outline-success" @click="minus(index)">-</button></td>
    <td>{{getQuantity}}</td>
    <td><button type="button" class="btn btn-outline-success" @click="plus(index)">+</button></td>
    <td>Rp {{formating(getTotalPrice)}}</td>
    <td><button type="button" class="btn btn-outline-danger" @click="remove(index)">X</button></td>
  </tr>
</template>

<script>
export default {
  props: {
    product: Object,
    index: Number,
    quantity: Number,
    totalPrice: Number
  },
  data () {
    return {
      cart: {
        product: {},
        quantity: 0,
        totalPrice: 0
      },
      productIndex: 0
    }
  },
  computed: {
    getQuantity: function () {
      return this.cart.quantity
    },
    getTotalPrice: function () {
      return this.cart.totalPrice
    }
  },
  created () {
    this.cart.product = this.product
    this.cart.quantity = this.quantity
    this.cart.totalPrice = this.totalPrice
    this.productIndex = this.index
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
    minus (i) {
      if (this.cart.quantity > 0) {
        this.cart.quantity--
        this.cart.totalPrice = this.cart.product.price * this.cart.quantity
      }
      this.$emit('updateCart', this.cart, i)
    },
    plus (i) {
      if (this.cart.quantity < this.cart.product.stock) {
        this.cart.quantity++
        this.cart.totalPrice = this.cart.product.price * this.cart.quantity
      }
      this.$emit('updateCart', this.cart, i)
    },
    remove (i) {
      this.$emit('removeCart', i)
    }
  }
}
</script>

<style>

</style>
