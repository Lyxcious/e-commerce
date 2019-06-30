# E-Commerce (LovelyCart)
----------------------------------------

## Endpoint

### *Doesn't Require Token*

#### User Routes
| Routes| Method | Request Body | Response Data| Response Error | Description |
|----------------------|--------|-----------------------------|-----------------------------------|--|---------------------------------------------------------------|
| `/user/register`| POST | `{ name, email, password }` | `{ access_token }` | 400 (`{email}` has been registered!) <br>400 (`{email}` is not a valid email!) <br> 400 (Password must be more or equal than 8 character!) <br> 500 (Internal Server Error) |Register with new user info|
| `/user/login` | POST | `{ email, password }`| `{ name, access_token }`| 400 (Wrong email/password) <br> 500 (Internal Server Error) | Login and get an access token and name |
| `/user/signingoogle` | POST | `{ token }` | `{ name, access_token }` | 500 (Internal Server Error)  | Sign in with Google and get an access token, name, new password |

### Product Routes

####  *Doesn't Require Token*
| Routes | Method | Request Body | Response Success | Response Error | Description|
|-----------------------------------|--------|----------------------------------|------------------|---------------------|------------------------------------------------------------------------------|
| `/product/list`| GET | -| `{ data }`| 500 (Internal Server Error) | Get all the products |
| `/product/detail/:id` | GET | -| `{ data }`| 404 (Product with id `{ :id }` not found!)<br> 500 (Internal Server Error) | Get product match with id |

#### *Require Token* (`{ headers: { access_token } }`) 
| Routes | Method | Request Body | Response Success | Response Error | Description|
|-----------------------------------|--------|----------------------------------|------------------|---------------------|------------------------------------------------------------------------------|
| `/product/create`| POST | `{ name, desc, image, price, stock }` | `{ data }`| 400 (Invalid Token) <br> 400 (Product must have a name!) <br> 400 (Product must be have a price!) <br> 400 (Product price must be a number!) <br> 400 (product price must be a positive number!) <br> 400 (Product stock must be a number!) <br> 400 (Product stock must be a positive number!) <br> 401 (Please login first) <br> 403 (Only admin can access this!) <br> 404 (User not found) <br> 500 (Internal Server Error) | Create product (admin only) |
| `/product/update/:id` | PATCH | `{ name, desc, image, price, stock }` (all optional) | `{ data }` | 400 (Invalid Token)<br> 400 (Product must have a name!) <br> 400 (Product price must be a number!) <br> 400 (Product price must be a positive number!) <br> 400 (Product stock must be a number!) <br> 400 (Product stock must be a positive number!) <br> 401 (Please login first)  <br> 403 (Only admin can access this!) <br> 404 (User not found) <br> 404 (Product with id `{ :id }` not found!)  <br> 500 (Internal Server Error) | Update a product (admin only) |
| `/product/delete/:id` | DELETE | - | `{ result }` | 400 (Invalid Token)<br> 401 (Please login first) <br> 401 (Unauthorized) <br> 404 (User not found) <br> 404 (Product not found) <br> 500 (Internal Server Error) | Delete a product (admin only) |

### Cart Routes 

#### *Require Token* (`{ headers: { access_token } }`)
| Routes | Method | Request Body | Response Success | Response Error | Description|
|-----------------------------------|--------|----------------------------------|------------------|---------------------|------------------------------------------------------------------------------|
| `/cart/create`| POST | `{ name, desc, image, price, stock }` | `{ data }`| 400 (Invalid Token) <br> 400 (User already have an empty cart) <br> 401 (Please login first) <br> 404 (User not found) <br> 500 (Internal Server Error) | Create cart |
| `/cart/detail/:id` | GET | -| `{ data }`| 400 (Invalid Token) <br> 400 (User don't have an active cart) <br> 401 (Please login first) <br> 404 (User not found) <br> 500 (Internal Server Error) | Get cart match with id |
| `/cart/update/:id` | PATCH | `{ products(id), quantity }` | `{ data }` | 400 (Invalid Token) <br> 400 (Product quantity can't exceeded stock) <br> 400 (Quantity can't be a negative number) <br> 401 (Please login first) <br> 403 (Unauthorized) <br> 404 (User not found) <br> 404 (Cart with id `{ :id }` not found!) <br> 500 (Internal Server Error) | Update a cart (Owner only) |
| `/cart/checkout/:id` | PATCH | `{ products(id), quantity }` | `{ data }` | 400 (Invalid Token) <br> 400 (Product quantity can't exceeded stock) <br> 400 (Quantity can't be a negative number) <br> 401 (Please login first) <br> 403 (Unauthorized) <br> 404 (User not found) <br> 404 (Cart with id `{ :id }` not found!) <br> 500 (Internal Server Error) | Update a cart status to checkout (Owner only) |