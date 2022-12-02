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
    const albums = await redis.get("albums-json", ".");

    res.json(albums);
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

    const album = await redis.get("albums-json", `.${id}`);
    let albums = [];
    albums.push(album);
    albums.forEach(toJson);

    res.json(albums);
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

    await redis.set("albums-json", `.${data.id}`, data);
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

    await redis.set("albums-json", `.${id}`, data);
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

    await redis.del("albums-json", `.${id}`);

    res.json({ statusCode: 200, headers, body: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 422, headers, body: JSON.stringify(error) });
  }
});

exp.use(bodyParser.json());
exp.use("/.netlify/functions/albums", app);
module.exports = exp;
module.exports.handler = serverless(exp);
