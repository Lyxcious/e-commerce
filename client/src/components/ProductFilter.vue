<template>
  <div class="center d-flex flex-column justify-content-center">
    <h2 class="center">List Product</h2>
    <form id="filter" class='center align-middle' @submit.prevent="filterByName(nameFilter)">
      <div class="row">
          <div class="col">
            <div class="input-group input-group-md">
              <input type="text" name="filter" v-model="nameFilter" class="form-control form-control-md input-md" placeholder="Filter By Product Name">
              <span class="input-group-append">
                <button class="btn btn-success btn-md" type="submit">Search</button>
              </span>
            </div>
          </div>
      </div>
      <div class="row"  style="margin-top: 15px">
        <div class="col">
          <div class="input-group input-group-md d-flex justify-content-center">
            <button class="btn btn-success btn-md mr-3" type="button" @click="getAll">Get All Product</button>
            <button class="btn btn-success btn-md" type="button" @click="sortPrice">Sort by Price <i class="fas fa-arrow-up" v-if='sort == "asc"'></i><i class="fas fa-arrow-down" v-if='sort = "desc"'></i></button>
          </div>
        </div>
    </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ProductFilter',
  data () {
    return {
      nameFilter: '',
      sort: 'desc'
    }
  }
}
</script>

<style>

</style>
