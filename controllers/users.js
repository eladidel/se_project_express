const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
      console.log(user);
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError")
        return res.status(400).send({ message: err.message });
      if (err.name === "DocumentNotFoundError")
        return res.status(404).send({ message: err.message });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  if (!name || !avatar)
    return res.status(400).send({ message: "Invalid Name or Avatar" });

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError")
        return res.status(400).send({ message: err.message });
      return res.status(500).send({ message: err.message });
    });
};
