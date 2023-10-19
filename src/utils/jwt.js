const jwt = require("jsonwebtoken");
require("dotenv").config();

const { KEY_TOKEN } = process.env;

const options = {
  expiresIn: "24h",
};

async function genratejwt({ id }) {
  try {
    const payload = { id };
    const token = await jwt.sign(payload, KEY_TOKEN, options);

    return { error: false, token };
  } catch (error) {
    return { error: true };
  }
}

module.exports = genratejwt
