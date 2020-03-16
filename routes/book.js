const express = require('express');
const router = express.Router();

// Require controller modules
const bookController = require('../controllers/book');

/*
 * Route handling
 */

// GET request to create a book
router.get('/create', bookController.createGet);

// POST request to create a book
router.post('/create', bookController.createPost);

// GET request to delete a book
router.get('/:id/delete', bookController.deleteGet);

// POST request to delete a book
router.post('/:id/delete', bookController.deletePost);

// GET request to update a book
router.get('/:id/update', bookController.updateGet);

// GET request to update a book
router.post('/:id/update', bookController.updatePost);

// GET request for a book's page
router.get('/:id', bookController.page);

// GET request for the list of all books
router.get('/', bookController.list);

module.exports = router;
