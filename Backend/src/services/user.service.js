const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

const getUserById = (id) => {
    return User.findById(id);
}


const getUserByEmail = (email) => {
    return User.findOne({ email});
}

const createUser = async (user) => {
    console.log(user);
    const emailExists = await User.isEmailTaken(user.email) 
    if(emailExists) {
        throw new ApiError(httpStatus.OK, "Email already taken");
    }
    const newUser = User.create({name: user.name, email: user.email, password: user.password});
    return newUser;
}

const getUserAddressById = async (id) => {
    const user = await User.findOne({ _id: id}, { email: 1, address: 1 });
    return user;
};

const setAddress = async (user, newAddress) => {
  user.address = newAddress;
  await user.save();

  return user.address;
};


module.exports = {
    getUserById,
    getUserByEmail,
    createUser,
    getUserAddressById,
    setAddress
};
