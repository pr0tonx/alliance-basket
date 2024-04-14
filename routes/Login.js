const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/', (req, res) => authController.login(req, res));

module.exports = router;