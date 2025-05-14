const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

router.get('/tables', tableController.getAllTables);
router.get('/tables/:id', tableController.getTableById);
router.post('/tables', tableController.createTable);
router.put('/tables/:id', tableController.updateTable);
router.delete('/tables/:id', tableController.deleteTable);

module.exports = router;
