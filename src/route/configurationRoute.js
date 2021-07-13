const express = require('express');
const router = express.Router();
const controller = require('../controller/configurationController')

// router.post('/', controller.post);
// router.put('/:id', controller.put);
// router.delete('/:id', controller.delete);

router.get('/export/:id', controller.getExport);

module.exports = router;
