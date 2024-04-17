const express = require('express');
const router = express.Router();

const userRoute = require('./Clients');
const groupRoute = require('./Groups');
const membersRoute = require('./Member');
const loginRoute = require('./Login');
const registerRoute = require('./Register');

router.use("/clients", userRoute);
router.use("/groups", groupRoute);
router.use("/members", membersRoute);
router.use('/signup', registerRoute);
router.use('/login', loginRoute);

module.exports = router;

