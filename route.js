const express = require("express");
const router = express.Router();
const { addProfile } = require("./controller");

router.get("/", (req, res) => {
    console.log("ROOT HIT");
    res.send("API WORKING");
});
router.post('/profiles', addProfile);

module.exports = router;