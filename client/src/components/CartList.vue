<template>
  <div>
    <b-card-group deck>
      <b-card :title="product.name" :img-src="product.image" :img-alt="product.name" img-top class="mb-2" v-for="(product, index) in productsCart" :key="product.id">
        <b-card-text>
          {{product.desc}} aaaaaaaaa
        </b-card-text>
        <b-card-text>
          Price: Rp {{formating(product.price)}}aaaaaaaaaaaaaaaa
        </b-card-text>
        <b-card-text>
          <input type="number" min="0" :max="product.stock" v-model="cart.quantity[index]">
        </b-card-text>
        <b-card-text>
          <div>Total: Rp. {{formating(getTotal(quantity[index], product.price))}}</div>
        </b-card-text>
        <div>
          <b-button href="#" variant="danger" @click="deleteItem(index)">Delete</b-button>
        </div>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
export default {
  props: {
    products: Array
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
  computed: {
    getTotal (quantity, price) {
      return quantity * price
    }
  },
  methods: {
    deleteItem () {

    }
  }
}
</script>

<style>

</style>
