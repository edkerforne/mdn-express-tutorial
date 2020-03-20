const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.js');

// GET home page
router.get('/', indexController);

module.exports = router;
