const express = require("express");
const router = express.Router();

const {getWeatherData} = require('../controllers/Weather')

router.get("/weather",getWeatherData);

module.exports = router;