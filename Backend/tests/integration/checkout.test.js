const request = require("supertest");
const httpStatus = require("http-status");
const app = require("../../src/app");
const setupTestDB = require("../utils/setupTestDB");
const { Cart } = require("../../src/models");
const { userOne, userTwo, insertUsers } = require("../fixtures/user.fixture");
const {
  cartWithProductsUserOne,
  cartWithProductsUserTwo,
  emptyCart,
  insertCart,
} = require("../fixtures/cart.fixture");
const {
  userOneAccessToken,
  userTwoAccessToken,
} = require("../fixtures/token.fixture");
const config = require("../config/config");


setupTestDB();

describe("Cart routes", () => {
  describe("Checkout", () => {
    it("should return 401 if access token is missing", async () => {
      
      await insertUsers([userOne]);
      
      await insertCart([emptyCart]);

      
      const res = await request(app).put(`/v1/cart/checkout`).send();

      
      console.log(res.text);

      
       
      expect(res.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should return 400 if cart is empty", async () => {
      
      await insertUsers([userOne]);
      
      await insertCart([emptyCart]);

      
      const res = await request(app)
        .put(`/v1/cart/checkout`)
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .send();

      
       
       expect(res.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should return 400 if user's address is not set", async () => {
      expect(userTwo.address).toEqual(config.default_address);

      await insertUsers([userTwo]);
      await insertCart([cartWithProductsUserTwo]);

      const res = await request(app)
        .put(`/v1/cart/checkout`)
        .set("Authorization", `Bearer ${userTwoAccessToken}`)
        .send();

      
      
      expect(res.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should return 400 if not enough wallet balance", async () => {
      const userOneWithZeroBalance = { ...userOne, walletMoney: 0 };
      await insertUsers([userOneWithZeroBalance]);
      await insertCart([cartWithProductsUserOne]);

      const res = await request(app)
        .put(`/v1/cart/checkout`)
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .send();

      
      
      expect(res.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("should return 204 if cart is valid", async () => {
      await insertUsers([userOne]);
      await insertCart([cartWithProductsUserOne]);

      const res = await request(app)
        .put(`/v1/cart/checkout`)
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .send();

      
      
      expect(res.status).toEqual(httpStatus.NO_CONTENT);
      
      
      
      const cart = await Cart.findOne({email: userOne.email});
      expect(cart).toBeDefined();
      expect(cart.cartItems.length).toBe(0);
    });
  });
});
