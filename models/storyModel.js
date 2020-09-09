const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required in a story']
    },
    description: {
        type: String,
        required: [true, 'Description is required in a story']
    },
    images: [String],
    author: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Story = mongoose.model('Story', storySchema);

module.exports = Story