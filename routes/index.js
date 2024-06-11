const express = require('express');
const router = express.Router();

const userRoute = require('./Clients');
const groupRoute = require('./Groups');
const membersRoute = require('./Member');
const expensesRoute = require('./Expense');
const ticketsRoute = require('./Tickets');

router.use('/clients', userRoute);
router.use('/groups', groupRoute);
router.use('/expenses', expensesRoute);
router.use('/members', membersRoute);
router.use('/tickets', ticketsRoute);

module.exports = router;
