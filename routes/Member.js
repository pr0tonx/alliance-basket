const express = require('express');

const membersController = require('../controllers/membersController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/groups', authMiddleware.isAuth, (req, res) => membersController.addMember(req, res));

// router.get('/group/:id', (req, res) => membersController.listAllMembers(req, res));

module.exports = router;
