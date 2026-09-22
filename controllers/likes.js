const ClothingItem = require("../models/clothingItem");

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
        return res.status(404).send({ message: err.message });
      if (err.name === "CastError")
        return res.status(400).send({ message: err.message });
      return res.status(500).send({ message: err.message });
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
        return res.status(404).send({ message: err.message });
      if (err.name === "CastError")
        return res.status(400).send({ message: err.message });
      return res.status(500).send({ message: err.message });
    });
};
