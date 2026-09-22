const router = require("express").Router();
const {
  getClothingItems,
  createClothingItems,
  deleteClothingItems,
} = require("../controllers/clothingItems");
const { likeItem, dislikeItem } = require("../controllers/likes");

router.get("/", getClothingItems);
router.post("/", createClothingItems);
router.delete("/:itemId", deleteClothingItems);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
