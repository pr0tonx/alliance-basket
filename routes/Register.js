const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/', (req, res) => authController.signup(req, res));

module.exports = router;