const express = require('express')
const { createStory, deleteStory, getUserStories, uploadStoryImages, resizeStoryImages } = require('../controllers/storyController')
const { protect } = require('../controllers/authController')

const router = express.Router();

router.route('/').get(protect, getUserStories).post(protect, uploadStoryImages, resizeStoryImages, createStory)
router.route('/:id').delete(protect, deleteStory)

module.exports = router