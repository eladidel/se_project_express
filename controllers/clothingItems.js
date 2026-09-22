const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR.STATUS)
        .send({ message: SERVER_ERROR.MESSAGE });
    });
};

module.exports.createClothingItems = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const { _id } = req.user;

  ClothingItem.create({ name, weather, imageUrl, owner: _id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError")
        return res.status(BAD_REQUEST).send({ message: err.message });
      return res
        .status(SERVER_ERROR.STATUS)
        .send({ message: SERVER_ERROR.MESSAGE });
    });
};

module.exports.deleteClothingItems = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({ message: "Item was delete" }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError")
        return res.status(BAD_REQUEST).send({ message: err.message });
      if (err.name === "DocumentNotFoundError")
        return res.status(NOT_FOUND).send({ message: err.message });
      return res
        .status(SERVER_ERROR.STATUS)
        .send({ message: SERVER_ERROR.MESSAGE });
    });
};
