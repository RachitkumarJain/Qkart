const mongoose = require("mongoose");

const validator = require("validator");
const config = require("../config/config");
const bcrypt = require("bcryptjs");


const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    walletMoney: {
      type: Number,
      required: true,
      default: config.default_wallet_money
    },
    address: {
      type: String,
      default: config.default_address,
    },
  },
  {
    timestamps: true,
  }
);


userSchema.statics.isEmailTaken = async function (email) {
  const res = await this.findOne({email: email});
  if(res) {
    return true;
  }
  return false;
};

userSchema.methods.isPasswordMatch = async function(password) {
  let user = this;
  return bcrypt.compare(password, user.password);
}

userSchema.pre("save", async function(next) {
  const user = this;
  if(user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next()
});

userSchema.methods.hasSetNonDefaultAddress = async function () {
  const user = this;
   return user.address !== config.default_address;
};


module.exports.User = mongoose.model('User', userSchema);
