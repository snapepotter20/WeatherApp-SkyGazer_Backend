const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config();

// Middleware to parse JSON bodies
app.use(express.json());

const getWeatherData = async (req, res) => {
  try {
    let lat, lon;
    const { lat: latitude, lon: longitude, place } = req.query;
    let location;

    if (latitude && longitude) {
      lat = latitude;
      lon = longitude;
      const geoLocationResponse = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${process.env.GEOAPIFY_API_KEY}`
      );
      location = geoLocationResponse.data?.features[0]?.properties?.city;
    } else if (place) {
      const geoLocationResponse = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${place}&apiKey=${process.env.GEOAPIFY_API_KEY}`
      );
      if (geoLocationResponse.data?.features?.length > 0) {
        const firstLocation = geoLocationResponse.data.features[0];
        const latitude = firstLocation.properties.lat;
        const longitude = firstLocation.properties.lon;
        location = firstLocation.properties.city;
        lat = latitude;
        lon = longitude;
      } else {
        console.error("No location found for the given place name.");
      }
    }

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    const weatherData = weatherResponse.data;

    console.log("locationName, weatherData", location, weatherData);
    res.json({ location, weatherData });
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

module.exports = {
  getWeatherData,
};
