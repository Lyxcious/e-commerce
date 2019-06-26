<template>
  <div>
    <div class="center d-flex justify-content-center">
      <h2>Edit Product Form</h2>
    </div>
    <div class="center" style="width: 75%">
      <hr>
    </div>

    <ProductForm :product="product" class="form"/>
  </div>
</template>

<script>
import ax from '../api/server'
import ProductForm from '../components/ProductForm'
export default {
  components: {
    ProductForm
  },
  mounted () {
    ax({
      method: 'get',
      url: `/product/detail/${this.$route.params.id}`,
      headers: { access_token: localStorage.getItem('token') }
    })
      .then(({ data }) => {
        this.product.name = data.name
        this.product.image = data.image
        this.product.desc = data.desc
        this.product.price = data.price
        this.product.stock = data.stock
      })
      .catch(err => {
        this.$swal({
          type: 'error',
          title: `${err.response.data.message}`,
          showConfirmButton: true
        })
      })
  },
  data () {
    return {
      product: {
        name: '',
        image: '',
        desc: '',
        price: 0,
        stock: 0
      }
    }
  }
}
</script>

<style>
  .form {
    padding: 15px 30px;
    width: 50%;
  }
</style>
