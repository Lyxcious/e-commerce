<template>
  <div id="nav">
      <b-navbar variant="faded" type="light">
        <b-nav tabs align="center" class="col" md="auto">
          <b-nav-item :to="{ path: '/product/add'}" :active='$route.name =="product-add"'>Add</b-nav-item>
          <b-nav-item :to="{ path: '/product/list'}" :active='$route.name =="product-list"'>List</b-nav-item>
          <b-nav-item :to="{ path: `/product/edit/${product.id}`}" :active='$route.name =="product-edit"' v-if="page == 'edit'">Edit</b-nav-item>
        </b-nav>
      </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'NavBarProduct',
  props: {
    'product': Object,
    'page': String
  }
}
</script>

<style scoped>
  #nav {
    padding-top: 0;
  }
</style>
