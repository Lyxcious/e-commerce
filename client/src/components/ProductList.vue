<template>
  <div>
    <b-card-group deck>
      <b-card :title="product.name" :img-src="product.image" :img-alt="product.name" img-top class="mb-2" v-for="product in products" :key="product.id">
        <b-card-text>
          {{product.desc}}
        </b-card-text>
        <b-card-text>
          Price: Rp {{formating(product.price)}}
        </b-card-text>
        <b-card-text>
          Stock: {{product.stock}}
        </b-card-text>
        <div>
          <b-button href="#" variant="primary">Add to Cart</b-button>
          <b-button href="#" variant="success">Edit</b-button>
          <b-button href="#" variant="danger">Delete</b-button>
        </div>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
export default {
  props: {
    products: Array
  }
}
</script>

<style>

</style>
