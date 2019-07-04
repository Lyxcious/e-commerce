<template>
  <div class="d-flex flex-wrap justify-content-start">
    <b-card-group v-for="product in products" :key="product.id" style="width: 350px" class="mr-3 mb-3">
      <b-card :img-src="product.image" :img-alt="product.name" img-top img-height="300" style="text-align: left; font-size: 16px" class="d-flex flex-column justify-content-between" >
        <b-card-text style="font-size: 18px; font-weight: 600">
          {{product.name}}
        </b-card-text>
        <b-card-text v-html="product.desc" style="font-size: 14px">
          Description: {{product.desc}}
        </b-card-text>
        <b-card-text style="font-size: 14px">
          Price: Rp {{formating(product.price)}}
        </b-card-text>
        <b-card-text v-if="product.stock > 0">
          Stock: {{product.stock}}
        </b-card-text>
        <b-card-text v-else>
          Stock: Habis
        </b-card-text>
        <div slot="footer" class="text-center">
          <b-button href="#" variant="primary" v-if="user.email != 'admin@admin.com'" @click="addToCart(product._id, product.stock)">Add to Cart</b-button>
          <b-button href="#" variant="success" v-if="user.email == 'admin@admin.com'" @click="editProduct(product._id)" class="mr-2">Edit</b-button>
          <b-button href="#" variant="danger" v-if="user.email == 'admin@admin.com'" @click="deleteProduct(product._id)">Delete</b-button>
        </div>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
export default {
  props: {
    products: Array,
    user: Object
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
    editProduct (id) {
      this.$router.push({ path: `/product/edit/${id}` })
    },
    addToCart (id, stock) {
      if (localStorage.getItem('token')) {
        if (stock > 0) {
          this.$emit('addToCart', id)
        } else {
          this.$swal({
            type: 'error',
            title: 'Product Sold Out!',
            showConfirmButton: false,
            timer: 3000
          })
        }
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style>

</style>
