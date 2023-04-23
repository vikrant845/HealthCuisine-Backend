const mongoose = require('mongoose');
const slugify = require('slugify');

const exerciseSchema = new mongoose.Schema({
    exerciseName: {
        type: String,
        trim: true,
        required: true
    },
    slug: String,
    bodyPart: {
        type: String,
        minlength: [ 3, 'Please enter atleast 3 characters' ],
        maxlength: [ 30, 'Please enter atmost 30 characters' ],
        trim: true,
        required: true
    },
    equipment: {
        type: String,
        trim: true,
        required: true
    },
    target: {
        type: String,
        trim: true,
        required: true
    },
    gifUrl: String,
    like: {
        type: Number,
        default: 0,
        min: 0
    }
});

exerciseSchema.pre('save', function(next) {
    this.slug = slugify(this.exerciseName);
    next();
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;