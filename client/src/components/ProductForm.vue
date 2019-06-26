<template>
  <form class="form-product center" @submit.prevent="formSubmit" enctype="multipart/form-data">
    <div class="form-group">
      <label>Name</label>
      <input type="text" class="form-control" v-model="product.name" placeholder="Enter Product Name" required>
    </div>

    <div class="form-group d-flex">
      <div class="row">
        <div class="col">
          <img :src="product.image" width="200" height="200" class="mr-1">
        </div>
      </div>

      <div class="row d-flex flex-column">
        <div class="col-1">
          <label>Image</label>
        </div>

        <div class="col">
          <input type="file" class="border" style="border-radius: 5px" accept="image/*" @change="changeToBase64($event)">
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>Description</label>
      <div style="text-align: left">
        <ckeditor :editor="editor" v-model="product.desc"></ckeditor>
      </div>
    </div>

    <div class="form-group" style="width: 50%; margin: 10px auto">
      <label>Price</label>
      <input type="number" class="form-control" v-model="product.price" min="0" required>
    </div>

    <div class="form-group" style="width: 50%; margin: 10px auto">
      <label>Stock</label>
      <input type="number" class="form-control" v-model="product.stock" min="0" required>
    </div>

    <div class="col text-center" >
      <button type="submit" class="btn btn-primary center">Submit</button>
    </div>
  </form>
</template>

<script>
import ax from '../api/server'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
export default {
  props: {
    product: Object
  },
  data () {
    return {
      editor: ClassicEditor,
      productSubmit: {
        name: '',
        image: '',
        imageSend: '',
        desc: '',
        price: 0,
        stock: 0
      }
    }
  },
  methods: {
    changeToBase64 ($event) {
      var file = $event.target.files[0]
      if (file) {
        this.productSubmit.imageSend = file
      } else {
        this.productSubmit.imageSend = ''
      }
      console.log(file)
      if (file) {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          console.log(reader.result)
          this.productSubmit.image = reader.result
          this.product.image = reader.result
        }
        reader.onerror = function (error) {
          console.log('Error: ', error)
        }
      } else {
        this.productSubmit.image = ''
      }
    },
    formSubmit () {
      this.productSubmit.name = this.product.name
      this.productSubmit.image = this.product.image
      this.productSubmit.desc = this.product.desc
      this.productSubmit.price = this.product.price
      this.productSubmit.stock = this.product.stock
      let formData = new FormData()
      formData.append('name', this.productSubmit.name)
      formData.append('image', this.productSubmit.imageSend)
      formData.append('desc', this.productSubmit.desc)
      formData.append('price', this.productSubmit.price)
      formData.append('stock', this.productSubmit.stock)
      if (this.$route.name === 'product-add') {
        ax({
          method: 'post',
          url: '/product/create',
          data: formData,
          headers: { access_token: localStorage.getItem('token'), 'Content-Type': 'multipart/form-data' }
        })
          .then(({ data }) => {
            this.$swal({
              type: 'success',
              title: 'Product added successfully',
              showConfirmButton: false,
              timer: 3000
            })
            this.$emit('reset')
          })
          .catch(err => {
            this.$swal({
              type: 'error',
              title: `${err.response.data.message}`,
              showConfirmButton: true
            })
          })
      } else {
        ax({
          method: 'patch',
          url: `/product/update/${this.$route.params.id}`,
          data: formData,
          headers: { access_token: localStorage.getItem('token'), 'Content-Type': 'multipart/form-data' }
        })
          .then(({ data }) => {
            this.$swal({
              type: 'success',
              title: 'Product edited successfully',
              showConfirmButton: false,
              timer: 3000
            })
            this.$router.push({ path: '/' })
          })
          .catch(err => {
            this.$swal({
              type: 'error',
              title: `${err.response.data.message}`,
              showConfirmButton: true
            })
          })
      }
    }
  }
}
</script>

<style>

</style>
