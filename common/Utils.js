const jwt = require('jsonwebtoken');

const createToken = (id) => {
  return jwt.sign({id}, process.env.SECRET_TOKEN, {
      expiresIn: 3600
  });
}

const hashPassword = function (email, password) {
  return Buffer.from(`${email}:${process.env.SECRET_TOKEN}:${password}`).toString('base64');
}

module.exports = {
  createToken,
  hashPassword
}

