const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res
    .status(200)
    .json({ api: 1, db: require("mongoose").connection.readyState });
});
router.use("/issues", require("./issueRoutes"));
router.use("/users", require("./userRoutes"));

module.exports = router;
