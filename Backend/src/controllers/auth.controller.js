const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService } = require("../services");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const token = await tokenService.generateAuthTokens(user);
  console.log(user);
  console.log(token);
  return res.status(201).send({
    user: user,
    tokens: token
  })
});

const login = catchAsync(async (req, res) => {
  const body = req.body;
  const user = await authService.loginUserWithEmailAndPassword(body.email, body.password);
  if(!user.email && !user.password) {
    console.log("exe incdojcds");
    return res.status(401).send({
      code: 401,
      message: "Incorrect Email and Password"
    });
  }
  const token = await tokenService.generateAuthTokens(user);
  console.log(user, token);
  res.status(200).send({
    user: user,
    tokens: token
  });
});

module.exports = {
  register,
  login,
};
