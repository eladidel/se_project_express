const ClothingItem = require("../models/clothingItem");

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createClothingItems = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const { _id } = req.user;
  if (!name || !weather || !imageUrl)
    return res
      .status(400)
      .send({ message: "Invalid Name, weather or ImageURL" });

  ClothingItem.create({ name, weather, imageUrl, owner: _id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError")
        return res.status(400).send({ message: err.message });
      return res.status(500).send({ message: err.message });
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
        return res.status(400).send({ message: err.message });
      if (err.name === "DocumentNotFoundError")
        return res.status(404).send({ message: err.message });
      return res.status(500).send({ message: err.message });
    });
};
