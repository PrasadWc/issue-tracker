const express = require("express");
const router = express.Router();

router.use("/health", (res) => {
  res
    .status(200)
    .json({ api: 1, db: require("mongoose").connection.readyState });
});
router.use("/issues", require("./issueRoutes/issueRoutes"));
router.use("/users", require("./userRoutes"));

module.exports = router;
