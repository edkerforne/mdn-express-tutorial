const express = require('express');
const router = express.Router();

// Require controller modules
const bookInstanceController = require('../controllers/bookInstance');

/*
 * Route handling
 */

// GET request to create a book instance
router.get('/create', bookInstanceController.createGet);

// POST request to create a book instance
router.post('/create', bookInstanceController.createPost);

// GET request to delete a book instance
router.get('/:id/delete', bookInstanceController.deleteGet);

// POST request to delete a book instance
router.post('/:id/delete', bookInstanceController.deletePost);

// GET request to update a book instance
router.get('/:id/update', bookInstanceController.updateGet);

// GET request to update a book instance
router.post('/:id/update', bookInstanceController.updatePost);

// GET request for a book instance's page
router.get('/:id', bookInstanceController.page);

// GET request for the list of all books
router.get('/', bookInstanceController.list);

module.exports = router;
