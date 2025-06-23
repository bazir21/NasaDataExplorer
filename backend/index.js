require("dotenv").config();

const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");
const fs = require("fs");

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});