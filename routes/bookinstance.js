const express = require('express');
const router = express.Router();

// Require controller modules
const bookinstanceController = require('../controllers/bookinstance');

/*
 * Route handling
 */

// GET request to create a book instance
router.get('/create', bookinstanceController.createGet);

// POST request to create a book instance
router.post('/create', bookinstanceController.createPost);

// GET request to delete a book instance
router.get('/:id/delete', bookinstanceController.deleteGet);

// POST request to delete a book instance
router.post('/:id/delete', bookinstanceController.deletePost);

// GET request to update a book instance
router.get('/:id/update', bookinstanceController.updateGet);

// GET request to update a book instance
router.post('/:id/update', bookinstanceController.updatePost);

// GET request for a book instance's page
router.get('/:id', bookinstanceController.page);

// GET request for the list of all books
router.get('/', bookinstanceController.list);

module.exports = router;
