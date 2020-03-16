const express = require('express');
const router = express.Router();

// Require controller modules
const authorController = require('../controllers/author');

/*
 * Route handling
 */

// GET request to create an author
router.get('/create', authorController.createGet);

// POST request to create an author
router.post('/create', authorController.createPost);

// GET request to delete an author
router.get('/:id/delete', authorController.deleteGet);

// POST request to delete an author
router.post('/:id/delete', authorController.deletePost);

// GET request to update an author
router.get('/:id/update', authorController.updateGet);

// GET request to update an author
router.post('/:id/update', authorController.updatePost);

// GET request for an author's page
router.get('/:id', authorController.page);

// GET request for the list of all authors
router.get('/', authorController.list);

module.exports = router;
