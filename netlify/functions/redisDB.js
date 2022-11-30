"use strict";

const Rejson  = require('iorejson');
const fs = require('fs');

// console.log("Host: ", process.env.REDIS_HOST);
// console.log("Password: ", process.env.REDIS_PSW);

const redis = new Rejson({
  host: process.env.REDIS_HOST,
  port: 10487,
  password: process.env.REDIS_PSW,
});

module.exports = redis;
