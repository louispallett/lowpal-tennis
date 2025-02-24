const express = require("express");
const router = express.Router();

const categoryController = require("../Controllers/categoryController");

router.get("/get-category-detail", categoryController.getCategoryDetail);

module.exports = router;