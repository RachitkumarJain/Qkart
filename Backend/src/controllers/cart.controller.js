const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { cartService } = require("../services");

const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCartByUser(req.user);
  res.send(cart);
});


const addProductToCart = catchAsync(async (req, res) => {
  const cart = await cartService.addProductToCart(
    req.user,
    req.body.productId,
    req.body.quantity
  );

  res.status(httpStatus.CREATED).send(cart);
});

const updateProductInCart = catchAsync(async (req, res) => {
  const body = req.body;
  const quantity = body.quantity;
  const productId = body.productId;
  if(quantity === 0) {
    const cart = await cartService.deleteProductFromCart(req.user, productId);
    return res.status(204).send(cart);
  } else {
    const cart = await cartService.updateProductInCart(req.user, productId, quantity);
    return res.status(200).send(cart);
  }
});


const checkout = catchAsync(async (req, res) => {
  console.log("EXE");
   await cartService.checkout(req.user);
  return (
    res
      .status(204)
      .send()
  );
});

module.exports = {
  getCart,
  addProductToCart,
  updateProductInCart,
  checkout,
};
