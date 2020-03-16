const express = require('express');
const router = express.Router();

// Require controller modules
const genreController = require('../controllers/genre');

/*
 * Route handling
 */

// GET request to create a genre
router.get('/create', genreController.createGet);

// POST request to create a genre
router.post('/create', genreController.createPost);

// GET request to delete a genre
router.get('/:id/delete', genreController.deleteGet);

// POST request to delete a genre
router.post('/:id/delete', genreController.deletePost);

// GET request to update a genre
router.get('/:id/update', genreController.updateGet);

// GET request to update a genre
router.post('/:id/update', genreController.updatePost);

// GET request for a genre's page
router.get('/:id', genreController.page);

// GET request for the list of all books
router.get('/', genreController.list);

module.exports = router;
