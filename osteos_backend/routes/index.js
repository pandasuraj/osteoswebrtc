const router = require('express').Router();
const mainController = require('../controller/main.controller');

mainController.register(router);

module.exports = router;
