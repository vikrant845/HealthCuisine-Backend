const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    exercises: [{
        exercise: {
            type: mongoose.Schema.ObjectId,
            ref: 'Exercise'
        },
        reps: {
            type: Number,
            required: true,
            min: [ 1, 'An exercise should have minimum 1 rep' ]
        },
        rest: Number
    }],
    equipmentsRequired: [String],
    time: {
        hour: {
            type: Number,
            default: 0
        },
        minutes: {
            type: Number,
            default: 0
        }
    },
    private: {
        type: Boolean,
        default: true
    },
    createdBy: String
});

workoutSchema.pre(/^find/, function (next) {
    this.find({ private: { $ne: true } });
    next();
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;