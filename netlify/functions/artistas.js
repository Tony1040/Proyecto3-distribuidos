"use strict";
const express = require("express");
const serverless = require("serverless-http");
const exp = express();
const bodyParser = require("body-parser");

const redis = require("./redisDB");
const headers = require("./headerCORS");

function toJson(item, index, arr) {
  arr[index] = JSON.parse(JSON.stringify(item));
}

const app = express.Router();

app.get("/", async (req, res) => {
  try {
    redis.on("connect", function () {
      console.log("You are now connected");
    });
    const artists = await redis.get("artists-json", ".");

    res.json(artists);
  } catch (error) {
    console.log(error);
    return { statusCode: 400, headers, body: JSON.stringify(error) };
  }
});

app.options("/", (req, res) => {
  res.json({ statusCode: 200, headers, body: "OK" });
});

app.get("/:id", async (req, res) => {
  try {
    const id = req.path.split("/").reverse()[0];

    redis.on("connect", function () {
      console.log("You are now connected");
    });

    const artist = await redis.get("artists-json", `.${id}`);
    let artists = [];
    artists.push(artist);
    artists.forEach(toJson);

    res.json(artists);
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 400, headers, body: JSON.stringify(error) });
  }
});

app.get("/:id/albums", async (req, res) => {
  try {
    const id = req.path.split("/").reverse()[1];

    redis.on("connect", function () {
      console.log("You are now connected");
    });
    const all_albums = await redis.get("albums-json", `.`);
    let albums_for_artist = [];

    Object.keys(all_albums).map((album) => {
      if (all_albums[album].id_artista == id) {
        albums_for_artist.push(all_albums[album]);
      }
    });

    res.json(albums_for_artist);
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 400, headers, body: JSON.stringify(error) });
  }
});

app.post("/", async (req, res) => {
  try {
    redis.on("connect", function () {
      console.log("You are now connected");
    });

    const data = JSON.parse(JSON.stringify(req.body));

    await redis.set("artists-json", `.${data.id}`, data);
    res.json({ statusCode: 200, headers, body: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 400, headers, body: JSON.stringify(error) });
  }
});

app.put("/:id", async (req, res) => {
  try {
    const id = req.path.split("/").reverse()[0];
    redis.on("connect", function () {
      console.log("You are now connected");
    });

    const data = JSON.parse(JSON.stringify(req.body));

    await redis.set("artists-json", `.${id}`, data);
    res.json({ statusCode: 200, headers, body: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 400, headers, body: JSON.stringify(error) });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    redis.on("connect", function () {
      console.log("You are now connected");
    });

    const id = req.path.split("/").reverse()[0];

    await redis.del("artists-json", `.${id}`);
    
    const all_albums = await redis.get("albums-json", `.`);
    let albums_for_artist = [];

    Object.keys(all_albums).map((album) => {
      if (all_albums[album].id_artista == id) {
        albums_for_artist.push(all_albums[album]);
      }
    });

    albums_for_artist.forEach(async (element) => {
      await redis.del("albums-json", `.${element.id}`);
    });

    res.json({ statusCode: 200, headers, body: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 422, headers, body: JSON.stringify(error) });
  }
});

exp.use(bodyParser.json());
exp.use("/.netlify/functions/artistas", app);
module.exports = exp;
module.exports.handler = serverless(exp);
