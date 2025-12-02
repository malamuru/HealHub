const express = require('express');
const controller = require('../controllers/mainController');
const router = express.Router();

//GET/: renders landing page to the user
router.get('/', controller.index);

//GET/about: renders about page to the user
router.get('/about', controller.about);

//GET/contact: renders contact page to the user
router.get('/contact', controller.contact);

module.exports = router;