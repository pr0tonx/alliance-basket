const express = require('express');
const router = express.Router();

const userRoute = require('./Clients');
const groupRoute = require('./Groups');
const membersRoute = require('./Member');

router.use("/clients", userRoute);
router.use("/groups", groupRoute);
router.use("/members",membersRoute);

module.exports = router;

