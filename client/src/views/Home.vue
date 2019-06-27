<template>
  <div class="home">
    <ProductFilter :sort="sort" :nameFilter="nameFilter" class="form" @getAll="getAll" @sortPrice="sortPrice" @filterByName="filterByName"/>
    <ProductList :products="products" :user="user" @addToCart="addToCart"/>
  </div>
</template>

<script>
import ax from '../api/server'
import ProductFilter from '../components/ProductFilter'
import ProductList from '../components/ProductList'
export default {
  components: {
    ProductFilter,
    ProductList
  },
  props: {
    user: Object
  },
  data () {
    return {
      products: [],
      sort: '',
      nameFilter: ''
    }
  },
  created () {
    let products = []
    ax({
      method: 'get',
      url: '/product/list',
      headers: { access_token: localStorage.getItem('token') }
    })
      .then(({ data }) => {
        for (let i in data) {
          products.push(data[i])
        }
        this.products = products
      })
      .catch((err) => {
        this.$swal({
          type: 'error',
          title: `${err.response.data.message}`,
          showConfirmButton: true
        })
      })
  },
  methods: {
    getAll (products) {
      this.products = products
    },
    sortPrice (products, sortUpdate) {
      this.products = products
      this.sort = sortUpdate
    },
    filterByName (products) {
      this.products = products
    },
    addToCart (id) {
      this.$emit('addToCart', id)
    }
  }
}
</script>

<style scoped>
  .home {
    padding: 15px 45px;
  }
  .form {
    width: 40%;
    margin: 0 auto;
  }
</style>
