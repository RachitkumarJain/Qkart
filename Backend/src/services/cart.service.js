const httpStatus = require("http-status");
const { Cart, Product } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

const getCartByUser = async (user) => {
  const cart = await Cart.findOne({ email: user.email });
  if(!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  }
  return cart;
};

const addProductToCart = async (user, productId, quantity) => {
  let cart = await Cart.findOne({ email: user.email });
  if(!cart) {
    cart = await Cart.create({email: user.email, cartItems: []});
    console.log(cart);
    if(!cart) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  for(let cartItem of cart.cartItems) {
    if(cartItem.product._id == productId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Product already in cart. Use the cart sidebar to update or remove product from cart");
    }
  }

  const product = await Product.findById(productId);
  if(!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist in database");
  }

  cart.cartItems.push({product: product, quantity: quantity});
  await cart.save();
  return cart;
};

const updateProductInCart = async (user, productId, quantity) => {
  const cart = await Cart.findOne({ email: user.email });
  if(!cart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart. Use POST to create cart and add a product");
  }

  const product = await Product.findById(productId);
  if(!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist in database");
  }

  let productIndex = -1;
  
  
  for(let i=0; i<cart.cartItems.length; i++) {
    if(cart.cartItems[i].product._id == productId) {
      productIndex = i; 
    }
  }
  
  if(productIndex === -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
  }

  cart.cartItems[productIndex].quantity = quantity;
  await cart.save();
  return cart;
};


const deleteProductFromCart = async (user, productId) => {
  const cart = await Cart.findOne({ email: user.email });
  if(!cart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart");
  }

  let productIndex = -1;
  for(let i=0; i<cart.cartItems.length; i++) {
    if(cart.cartItems[i].product._id == productId) {
      productIndex = i; 
    }
  }

  cart.cartItems.splice(productIndex, 1);
  await cart.save();

  return cart;
};



const checkout = async (user) => {
  
  const cart = await Cart.findOne({ email: user.email });
  if(!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  }

  if(cart.cartItems && cart.cartItems.length == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User have empty cart");
  }

  const hasAddress = await user.hasSetNonDefaultAddress();
  if(!hasAddress) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't have an address");
  }

  let totalValue = 0;
  for(let cartItem of cart.cartItems) {
    totalValue += cartItem.product.cost * cartItem.quantity;
  }
  let balance = user.walletMoney - totalValue;

  if(balance < 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  user.walletMoney = balance;
  await user.save();

  cart.cartItems = [];
  await cart.save();
  
  return cart;
};

module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout,
};
