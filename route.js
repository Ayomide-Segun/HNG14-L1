const express = require("express");
const router = express.Router();
const { addProfile, getProfileUsingParams, getProfileUsingQuery } = require("./controller");

router.post('/profiles', addProfile);
router.get('/profiles/:id', getProfileUsingParams);
router.get('/profiles', getProfileUsingQuery);

module.exports = router;