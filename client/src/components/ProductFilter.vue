<template>
  <div class="center d-flex flex-column justify-content-center">
    <h2 class="center mb-3">List Product</h2>
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
            <button class="btn btn-success btn-md" type="button" @click="sortPrice">Sort by Price <i class="fas fa-arrow-up" v-if='sort == "asc"'></i><i class="fas fa-arrow-down" v-if='sort == "desc"'></i></button>
          </div>
        </div>
    </div>
    </form>
  </div>
</template>

<script>
import ax from '../api/server'
export default {
  name: 'ProductFilter',
  props: {
    nameFilter: String,
    sort: String
  },
  data () {
    return {
      products: [],
      sortUpdate: ''
    }
  },
  methods: {
    getAll () {
      this.products = []
      ax({
        method: 'get',
        url: '/product/list',
        headers: { access_token: localStorage.getItem('token') }
      })
        .then(({ data }) => {
          for (let i in data) {
            this.products.push(data[i])
          }
          this.$emit('getAll', this.products)
        })
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: `${err.response.data.message}`,
            showConfirmButton: true
          })
        })
    },
    sortPrice () {
      this.products = []
      ax({
        method: 'get',
        url: '/product/list',
        headers: { access_token: localStorage.getItem('token') }
      })
        .then(({ data }) => {
          for (let i in data) {
            this.products.push(data[i])
          }
          if (this.sort === 'desc' || this.sort === '') {
            this.products.sort((a, b) => { return a.price - b.price })
            this.sortUpdate = 'asc'
          } else {
            this.products.sort((a, b) => { return b.price - a.price })
            this.sortUpdate = 'desc'
          }
          this.$emit('sortPrice', this.products, this.sortUpdate)
        })
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: `${err.response.data.message}`,
            showConfirmButton: true
          })
        })
    },
    filterByName (name) {
      this.products = []
      let regex = new RegExp('(' + name + ')', 'i')
      ax({
        method: 'get',
        url: '/product/list',
        headers: { access_token: localStorage.getItem('token') }
      })
        .then(({ data }) => {
          for (let i in data) {
            if (regex.test(data[i].name)) {
              this.products.push(data[i])
            }
          }
          this.$emit('filterByName', this.products)
        })
        .catch((err) => {
          this.$swal({
            type: 'error',
            title: `${err.response.data.message}`,
            showConfirmButton: true
          })
        })
    }
  }
}
</script>

<style>

</style>
