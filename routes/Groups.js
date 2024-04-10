const express = require('express');

const groupsController = require('../controllers/groupsController');
const router = express.Router()

router.get('/', (req, res) => groupsController.getAllGroups(req, res));
router.put('/:idClient/groups/:idGroup', (req, res) => groupsController.editGroup(req, res));

module.exports = router
