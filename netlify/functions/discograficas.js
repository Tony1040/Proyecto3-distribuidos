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
    const discograficas = await redis.get("discograficas-json", ".");
    console.log(discograficas); // [ '7', '5', '3', '1' ]

    res.json(discograficas);
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

    const discografica = await redis.get("discograficas-json", `.${id}`);
    let discograficas = [];
    discograficas.push(discografica);
    discograficas.forEach(toJson);

    res.json(discograficas);
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
    let albums_for_publisher = [];

    Object.keys(all_albums).map((album) => {
      if (all_albums[album].id_discografica == id) {
        albums_for_publisher.push(all_albums[album]);
      }
    });

    res.json(albums_for_publisher);
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
    console.log(JSON.stringify(req.body));

    const data = JSON.parse(JSON.stringify(req.body));

    await redis.set("discograficas-json", `.${data.id}`, data);
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
    console.log(JSON.stringify(req.body));

    const data = JSON.parse(JSON.stringify(req.body));

    await redis.set("discograficas-json", `.${id}`, data);
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

    await redis.del("discograficas-json", `.${id}`);
    // await redis.decr("artist_N");

    res.json({ statusCode: 200, headers, body: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ statusCode: 422, headers, body: JSON.stringify(error) });
  }
});

exp.use(bodyParser.json());
exp.use("/.netlify/functions/discograficas", app);
module.exports = exp;
module.exports.handler = serverless(exp);
