<template>
  <div class="home">
    <ProductFilter class="form"/>
    <ProductList/>
  </div>
</template>

<script>
import ProductFilter from '../components/ProductFilter'
import ProductList from '../components/ProductList'
export default {
  components: {
    ProductFilter,
    ProductList
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
