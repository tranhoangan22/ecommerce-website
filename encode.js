const jwt = require("jsonwebtoken");

const tokenize = (email, secret) => jwt.sign({ email }, secret);

module.exports = tokenize;
