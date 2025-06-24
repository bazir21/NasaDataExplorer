require("dotenv").config();

const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const satellite = require("satellite.js");

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY;
const APOD_URL = "https://api.nasa.gov/planetary/apod";
const CACHE_FILE = path.join(__dirname, "cache.json");

function readCache() {
  try {
    const data = fs.readFileSync(CACHE_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading cache file:", error);
    return {};
  }
}

function writeCache(data) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 4), "utf8");
    console.log("Cache updated successfully");
  } catch (error) {
    console.error("Error writing to cache file:", error);
  }
}

function getOrbitPath(tleLine1, tleLine2, numPoints = 10) {
  const satrec = satellite.twoline2satrec(tleLine1, tleLine2);
  const startTime = new Date();
  const timeForFullOrbit = (1440 / satrec.no) * 60;
  const step = timeForFullOrbit / numPoints;

  const segments = [];
  let segment = [];
  let prevLength = null;

  for (let i = 0; i < timeForFullOrbit; i += step) {
    const time = new Date(startTime.getTime() + i * 1000);
    const positionAndVelocity = satellite.propagate(satrec, time);
    const positionEci = positionAndVelocity.position;

    if (!positionEci) continue;

    const gmst = satellite.gstime(time);
    const geodetic = satellite.eciToGeodetic(positionEci, gmst);
    const latitude = satellite.degreesLat(geodetic.latitude);
    const longitude = satellite.degreesLong(geodetic.longitude);
    const altitude = geodetic.height;

    if (prevLength !== null && Math.abs(longitude - prevLength) > 180) {
      if (segment.length > 0) segments.push(segment);
      segment = [];
    }
    segment.push([latitude, longitude, altitude]);
    prevLength = longitude;
  }
  if (segment.length > 0) segments.push(segment);

  return segments;
}

app.get("/APOD", async (req, res) => {
  try {
    console.log("Received request for APOD");

    const date = req.query.date || new Date().toISOString().split("T")[0];
    const cache = readCache();

    if (cache[date]) {
      console.log(`Returning cached data for ${date}`);
      return res.json(cache[date]);
    }
    else {
      console.log(`No cache found for ${date}, fetching from NASA API`);
      const response = await axios.get(APOD_URL, {
        params: {
          api_key: API_KEY,
          date: req.query.date || undefined,
        }
      });

      cache[date] = response.data;
      writeCache(cache);

      res.json(response.data);
    }
  } catch (error) {
    console.error("Error fetching APOD:", error);
    return res.status(500).json({ error: "Failed to fetch NASA APOD data" });
  }
});

app.get("/TLE", async (req, res) => {
  try {
    console.log("Received request for TLE data");

    const tleLine1 = 	"1 35932U 09051B   25173.43443703  .00000728  00000+0  15728-3 0  9995";
    const tleLine2 = "2 35932  98.4293  69.9099 0005602 249.6111 110.4488 14.61364324836599";

    const orbitPath = getOrbitPath(tleLine1, tleLine2);
    res.json(orbitPath);
  } catch (error) {
    console.error("Error fetching TLE data:", error);
    return res.status(500).json({ error: "Failed to fetch TLE data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});