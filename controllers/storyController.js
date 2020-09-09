const multer = require('multer')
const sharp = require('sharp')
const Story = require('../models/storyModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const multerStorage = multer.memoryStorage();

//? filtering the uploads (accepting images only)

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please upload only images', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadStoryImages = upload.array('images', 4);

exports.resizeStoryImages = catchAsync(async (req, res, next) => {
    if (!req.files) return next()

    req.body.images = []
    // processing the images
    await Promise.all(req.files.map(async (file, index) => {
        const filename = `story-${req.user._id}-${Date.now()}-${index + 1}.jpeg`

        await sharp(file.buffer)
            // .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/stories/${filename}`);

        req.body.images.push(filename);
    }))

    next()
})

exports.createStory = catchAsync(async (req, res, next) => {
    // console.log(req.files);
    // console.log(req.body)
    const { title, description, images } = req.body;
    const userId = req.user._id;
    const story = await Story.create({ title, description, images, author: userId });

    res.status(201).json({
        status: 'success',
        story
    })
})

exports.getUserStories = catchAsync(async (req, res, next) => {
    const stories = await Story.find({ author: req.user._id })

    res.status(200).json({
        status: 'success',
        stories
    })
})

exports.deleteStory = catchAsync(async (req, res, next) => {
    const story = await Story.findById(req.params.id);
    if (req.user._id !== story.author) return next(new AppError('You dont have the permission to perfom this action', 403))
    else await Story.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'success',
        data: null
    })
})