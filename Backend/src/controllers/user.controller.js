const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");

const getUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const address = req.query.q;
  let user;
  if(address) {
    user = await userService.getUserAddressById(userId);
  } else {
    user = await userService.getUserById(userId);
  }

  if(!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if(user.email !== req.user.email) {
    throw new ApiError(httpStatus.FORBIDDEN, "User not found")
  }
  
  if(address) {
    return res.status(200).send({address: user.address});
  } else {
    return res.status(200).send(user);
  }
});

const setAddress = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  console.log("EXE");
  console.log(req.body.address);
  console.log(user);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.email != req.user.email) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "User not authorized to access this resource"
    );
  }

  const address = await userService.setAddress(user, req.body.address);

  res.send({
    address: address,
  });
});

module.exports = {
  getUser,
  setAddress,
};
