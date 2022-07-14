const { Product } = require("../../src/models");
const { productService } = require("../../src/services");
const { productOne, productTwo } = require("../fixtures/product.fixture");
const mockingoose = require("mockingoose").default;

describe("Product test", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe("GET products", () => {
    it("should return list of products", async () => {
      
      mockingoose(Product).toReturn([productOne, productTwo], "find");

      let productResponse = await productService.getProducts();

      expect(JSON.stringify(productResponse)).toEqual(
        JSON.stringify([productOne, productTwo])
      );
    });
  });

  describe("GET products by id", () => {
    it("should return one product", async () => {
      
      mockingoose(Product).toReturn(productOne, "findOne");

      let productResponse = await productService.getProductById("1111");

      expect(JSON.stringify(productResponse)).toEqual(
        JSON.stringify(productOne)
      );
    });
  });
});
