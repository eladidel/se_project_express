const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT_ERROR,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR.STATUS)
        .send({ message: SERVER_ERROR.MESSAGE });
    });
};

module.exports.getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError")
        return res.status(BAD_REQUEST).send({ message: err.message });
      if (err.name === "DocumentNotFoundError")
        return res.status(NOT_FOUND).send({ message: err.message });
      return res
        .status(SERVER_ERROR.STATUS)
        .send({ message: SERVER_ERROR.MESSAGE });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userobj = user.toObject();
      delete userobj.password;
      res.status(201).send(userobj);
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000)
        return res.status(CONFLICT_ERROR).send({ message: err.message });
      if (err.name === "ValidationError")
        return res.status(BAD_REQUEST).send({ message: err.message });
      return res
        .status(SERVER_ERROR.STATUS)
        .send({ message: SERVER_ERROR.MESSAGE });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(BAD_REQUEST).send({ message: err.message });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.status(200).send(user);
      console.log(user);
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError")
        return res.status(BAD_REQUEST).send({ message: err.message });
      if (err.name === "DocumentNotFoundError")
        return res.status(NOT_FOUND).send({ message: err.message });
      return res
        .status(SERVER_ERROR.STATUS)
        .send({ message: SERVER_ERROR.MESSAGE });
    });
};
