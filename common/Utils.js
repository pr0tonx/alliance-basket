const jwt = require('jsonwebtoken');

const createToken = (id) => {
  return jwt.sign({id}, process.env.SECRET_TOKEN, {
      expiresIn: 3600
  });
}

const hashPassword = function ( password) {
  return Buffer.from(`${process.env.SECRET_TOKEN}:${password}`).toString('base64');
}

module.exports = {
  createToken,
  hashPassword
}

