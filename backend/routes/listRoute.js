const express = require("express");
const {
  displayItemController,
  deleteItemController,
  updateItemController,
  insertItemController,
} = require("../controllers/listController");

const router = express.Router();

router.post("/additem", insertItemController);
router.put("/updateitem", updateItemController);
router.post("/getitems", displayItemController);
router.delete("/deleteitem", deleteItemController);

module.exports = router;
