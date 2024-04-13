const express = require('express');

const membersController = require('../controllers/membersController');
const router = express.Router()

router.get('/group/:id', (req, res) => membersController.listAllMembers(req, res));

module.exports = router

