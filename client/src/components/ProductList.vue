<template>
  <div>
    <b-card-group columns style="column-count: 5">
      <b-card v-for="product in products" :title="product.name" :img-src="product.image" :img-alt="product.name" img-top img-height="300" :key="product.id" style="text-align: left" class="d-flex flex-column justify-content-between">
        <b-card-text v-html="product.desc">
          Description: {{product.desc}}
        </b-card-text>
        <b-card-text>
          Price: Rp {{formating(product.price)}}
        </b-card-text>
        <b-card-text v-if="product.stock > 0">
          Stock: {{product.stock}}
        </b-card-text>
        <b-card-text v-else>
          Stock: Habis
        </b-card-text>
        <div slot="footer" class="text-center">
          <b-button href="#" variant="primary" v-if="user.email != 'admin@admin.com'" @click="addToCart(product._id)">Add to Cart</b-button>
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
    addToCart (id) {
      this.$emit('addToCart', id)
    }
  }
}
</script>

<style>

</style>
