const express = require('express');
const router = express.Router();

const userRoute = require('./Clients');
const groupRoute = require('./Groups');
const membersRoute = require('./Member');
const expenseRoute = require('./Expense');

router.use("/clients", userRoute);
router.use("/groups", groupRoute);
router.use("/members", membersRoute);
router.use("/expenses",expenseRoute);

module.exports = router;

