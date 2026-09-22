const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

module.exports.likeItem = (req, res) => {
  const { _id } = req.user;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: _id } },
    { new: true }
  )
    .orFail()
    .then(() => res.status(200).send({ message: "Liked item" }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError")
        return res.status(NOT_FOUND).send({ message: err.message });
      if (err.name === "CastError")
        return res.status(BAD_REQUEST).send({ message: err.message });
      return res
        .status(SERVER_ERROR.STATUS)
        .send({ message: SERVER_ERROR.MESSAGE });
    });
};

module.exports.dislikeItem = (req, res) => {
  const { _id } = req.user;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: _id } },
    { new: true }
  )
    .orFail()
    .then(() => res.status(200).send({ message: "Disliked Item" }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError")
        return res.status(NOT_FOUND).send({ message: err.message });
      if (err.name === "CastError")
        return res.status(BAD_REQUEST).send({ message: err.message });
      return res
        .status(SERVER_ERROR.STATUS)
        .send({ message: SERVER_ERROR.MESSAGE });
    });
};
