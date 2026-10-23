const router = require("express").Router();
const {
  getClothingItems,
  createClothingItems,
  deleteClothingItems,
} = require("../controllers/clothingItems");
const { likeItem, dislikeItem } = require("../controllers/likes");
const auth = require("../middlewares/auth.js");

router.get("/", getClothingItems);
router.post("/", auth, createClothingItems);
router.delete("/:itemId", auth, deleteClothingItems);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
