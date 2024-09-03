const express = require("express");
const {
  authenticateController,
  registerController,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerController);
router.post("/authenticate", authenticateController);

module.exports = router;
