const jwt = require('jsonwebtoken');

const createToken = (id) => {
  return jwt.sign({id}, process.env.SECRET_TOKEN, {
      expiresIn: 3600
  });
}

const hashPassword = function (email, password) {
  return Buffer.from(`${email}:${process.env.SECRET_TOKEN}:${password}`).toString('base64');
}

const removeEmptyValues = function (obj) {
  const newObj = {};
  
  for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined && value !== '' && !Number.isNaN(value)) {
          newObj[key] = value;
      }
  }
  
  return newObj;
}

module.exports = {
  createToken,
  hashPassword,
  removeEmptyValues,
}

