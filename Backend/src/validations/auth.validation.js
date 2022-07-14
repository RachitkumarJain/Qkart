const Joi = require("joi");
const { password } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().required().email(),
    password: Joi.string().required().custom(password)
  })
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().trim().required().email(),
    password: Joi.string().required().custom(password)
  })
};

module.exports = {
  register,
  login,
};
