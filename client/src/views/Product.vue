<template>
  <div class="product">
    <router-view :selectedProduct="selectedProduct"/>
  </div>
</template>

<script>
export default {
  props: {
    selectedProduct: Object
  }
}
</script>

<style scoped>

</style>
