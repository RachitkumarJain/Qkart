const { User } = require("../../src/models");
const { userOne } = require("../fixtures/user.fixture");
const { userService } = require("../../src/services");
const ApiError = require("../../src/utils/ApiError");
const mockingoose = require("mockingoose").default;

describe("User test", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe("Get user by email", () => {
    it("should return user", async () => {
      
      mockingoose(User).toReturn(userOne, "findOne");

      let userResponse = await userService.getUserByEmail(userOne.email);

      
      expect(userResponse._id).toEqual(userOne._id);

      
      
      expect(userResponse.name).toBe(userOne.name);
    });
  });

  describe("Get user by id", () => {
    it("should return user", async () => {
      mockingoose(User).toReturn(userOne, "findOne");

      let userResponse = await userService.getUserById("111");

      expect(userResponse._id).toEqual(userOne._id);
      expect(userResponse.name).toBe(userOne.name);
    });
  });

  describe("Create user", () => {
    it("should return user if success", async () => {
      
      let isEmailTakenMock = jest.fn();
      User.isEmailTaken = isEmailTakenMock.mockReturnValue(false);

      
      let createMock = jest.fn();
      User.create = createMock.mockReturnValue(userOne);

      let userResponse = await userService.createUser(userOne);
      
      expect(createMock).toBeCalled();
      expect(isEmailTakenMock).toBeCalled();

      expect(userResponse._id).toEqual(userOne._id);
      expect(userResponse.name).toBe(userOne.name);
    });

    it("should throw error if email already exists", async () => {
      User.isEmailTaken = jest.fn().mockReturnValue(true);

      expect(userService.createUser(userOne)).rejects.toThrow(ApiError);
    });
  });

  describe("GET user's address", () => {
    it("should only ask for email and address fields", async () => {
      const findOneMock = jest.fn();
      const expectedOutput = {
        _id: userOne._id,
        email: userOne.email,
        address: userOne.address,
      };

      
      User.findOne = findOneMock.mockReturnValue(expectedOutput);

      const res = await userService.getUserAddressById(userOne._id);

      expect(res).toEqual(expectedOutput);

      expect(findOneMock).toHaveBeenCalled();
      expect(findOneMock).toHaveBeenCalledWith(
        {
          _id: userOne._id,
        },
        {
          email: 1,
          address: 1,
        }
      );
    });
  });

  describe("SET user's address", () => {
    it("should save the address", async () => {
      const newAddress = "My new awesome address";

      let saveMock = (...args) => {
        expect(args[0].address).toEqual(newAddress);
        return args[0];
      };

      mockingoose(User).toReturn(saveMock, "save");

      const userOneMongooseDoc = new User(userOne);
      await userService.setAddress(userOneMongooseDoc, newAddress);
    });
  });
});
