const express = require("express");
const router = express.Router();
const { addProfile } = require("./controller");

router.post('/profiles', addProfile);

module.exports = router;