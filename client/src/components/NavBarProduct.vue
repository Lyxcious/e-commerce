<template>
  <div id="nav">
      <b-navbar variant="faded" type="light">
        <b-nav tabs align="center" class="col" md="auto">
          <b-nav-item :to="{ path: '/product/add'}" :active='$route.name =="product-add"'>Add</b-nav-item>
          <b-nav-item disabled :active='$route.name =="product-edit"'>Edit</b-nav-item>
        </b-nav>
      </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'NavBarProduct',
  props: {
    'product': Object
  }
}
</script>

<style scoped>
  #nav {
    padding-top: 0;
  }
</style>
