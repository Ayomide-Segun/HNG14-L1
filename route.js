const express = require("express");
const router = express.Router();
const { addProfile, getProfileUsingParams, getProfileUsingQuery,deleteProfiles  } = require("./controller");

router.post('/profiles', addProfile);
router.get('/profiles/:id', getProfileUsingParams);
router.get('/profiles', getProfileUsingQuery);
router.delete('/profiles/:id', deleteProfiles);

module.exports = router;