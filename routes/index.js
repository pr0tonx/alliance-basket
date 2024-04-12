const express = require('express');
const router = express.Router();

const userRoute = require('./Clients');
const groupRoute = require('./Groups');

router.use("/clients", userRoute);
router.use("/groups", groupRoute);

module.exports = router;
