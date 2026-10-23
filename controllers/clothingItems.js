const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

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
  const { _id } = req.user;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== _id) {
        return Promise.reject(
          Object.assign(new Error("You can only delete your own items"), {
            name: "ForbiddenError",
          })
        );
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Item deleted" }));
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError")
        return res.status(BAD_REQUEST).send({ message: err.message });
      if (err.name === "DocumentNotFoundError")
        return res.status(NOT_FOUND).send({ message: err.message });
      if (err.name === "ForbiddenError")
        return res.status(FORBIDDEN).send({ message: err.message });
      return res
        .status(SERVER_ERROR.STATUS)
        .send({ message: SERVER_ERROR.MESSAGE });
    });
};
