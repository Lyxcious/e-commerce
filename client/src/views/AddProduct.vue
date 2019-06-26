<template>
  <div class="center">
    <div class="center d-flex justify-content-center">
      <h2>Add Product Form</h2>
    </div>
    <ProductForm :product="newProduct" class="form" @reset="reset"/>
  </div>
</template>

<script>
import ProductForm from '../components/ProductForm'
export default {
  components: {
    ProductForm
  },
  data () {
    return {
      newProduct: {
        name: '',
        image: 'https://www.hayaleturk.com/wp-content/uploads/2018/03/no-image.jpg',
        desc: '',
        price: 0,
        stock: 0
      }
    }
  },
  methods: {
    reset () {
      this.newProduct = {
        name: '',
        image: 'https://www.hayaleturk.com/wp-content/uploads/2018/03/no-image.jpg',
        desc: '',
        price: 0,
        stock: 0
      }
    }
  }
}
</script>

<style>
  .center {
    margin: 0 auto;
  }
  .form {
    padding: 15px 30px;
    width: 50%;
  }
</style>
