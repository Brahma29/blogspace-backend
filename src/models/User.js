const mongoose = require("mongoose");
const { isAlphabetic, isEmail } = require("../validators/common");
const { hash, compareHash } = require("../utils/hashing");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      validate: {
        validator: isAlphabetic,
        message: "First name should contain only alphabets",
      },
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
      validate: {
        validator: isAlphabetic,
        message: "Last name should contain only alphabets",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      validate: {
        validator: isEmail,
        message: (props) => `${props.value} is not a valid email`,
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profile: {
      type: String,
      default: "avatar.jpg",
    },
  },
  { timestamps: true }
);

// eslint-disable-next-line func-names
userSchema.methods.matchPassword = async function (enteredPassword) {
  // eslint-disable-next-line no-return-await
  return await compareHash(this.password, enteredPassword);
};

// eslint-disable-next-line func-names
userSchema.pre("save", async function (next) {
  const self = this;
  if (!self.isModified("password")) {
    next();
  }
  self.password = await hash(this.password);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
