const Manipulate = require('../utils/Manipulate');
const Exercise = require('../models/exerciseModel');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');

exports.getAll = catchAsync(async (req, res) => {
    const query = await new Manipulate(Exercise.find(), req.query).filter().sort().filterFields().paginate();
    const exercises = await query.query;
    res.status(200).json({ exercises, results: exercises.length });
})

exports.getOne = catchAsync(async (req, res, next) => {
    const exercise = await Exercise.findOne({ _id: req.params.id });
    res.status(200).json({
        exercise
    });
});

exports.addOne = catchAsync(async (req, res, next) => {
    const exercise = await Exercise.create(req.body);
    res.status(201).json(exercise);
})

exports.bodyPart = catchAsync(async (req, res, next) => {
    const bodyParts = await Exercise.find().select('bodyPart').distinct('bodyPart');
    res.status(200).json({ bodyParts });
})

exports.target = catchAsync(async (req, res, next) => {
    const targets = await Exercise.find().select('target').distinct('target');
    res.status(200).json({ targets });
})

exports.likeUnlike = (action) => {
    return catchAsync(async (req, res, next) => {
        let incDec = 0;
        let user = undefined, workout = undefined;
        if (action === 'like') {
            incDec = 1;
            user = await User.findByIdAndUpdate(req.user._id, { $addToSet: { likedWorkouts: req.params.exerciseId } }, { new: true, runValidators: true });
        }
        else if (action === 'unlike') {
            incDec = -1;
            user = await User.findByIdAndUpdate(req.user._id, { $pull: { likedWorkouts: req.params.exerciseId } }, { new: true, runValidators: true });
        }
        workout = await Exercise.findByIdAndUpdate(req.params.exerciseId, { $inc: { like: incDec } }, { new: true, runValidators: true });
        res.status(200).json({
            message: `Workout ${ action.charAt(0).toUpperCase() + action.slice(1, -1) }ed`,
            data: {
                user,
                workout
            }
        });
    })
}

exports.addToOngoing = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, { $addToSet: { ongoingWorkouts: req.params.exerciseId } }, { new: true, runValidators: true });
    res.status(200).json({
        message: 'Workout added',
        user
    });
});

exports.removeFromOngoing = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, { $pull: { ongoingWorkouts: req.params.exerciseId } }, { new: true, runValidators: true });
    res.status(200).json({
        message: 'Workout removed',
        user
    });
});

exports.search = catchAsync(async (req, res, next) => {
    const exercises = await Exercise.find({
        $or: [
            { exerciseName: { $regex: req.params.searchQuery, $options: 'i' }},
            { bodyPart: { $regex: req.params.searchQuery, $options: 'i' }},
            { target: { $regex: req.params.searchQuery, $options: 'i' }},
            { equipment: { $regex: req.params.searchQuery, $options: 'i' }},
        ]
    });

    console.log(req.params.searchQuery);
    
    res.status(exercises.length > 0 ? 200 : 404).json({
        message: exercises.length > 0 ? 'Found results' : 'No exercises found',
        exercises: exercises.length > 0 ? exercises : undefined,
        results: exercises.length
    });
});