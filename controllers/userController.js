const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const Manipulate = require('../utils/Manipulate');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAll = catchAsync(async (req, res) => {
    const query = await new Manipulate(User.find(), req.query).filter().sort().filterFields().paginate();
    const users = await query.query;
    res.status(200).json(users);
})

exports.addOne = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json(user);
})

exports.verify = catchAsync(async (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        res.status(404).json({
            valid: false
        });
        return;
    }
    const decoded = await promisify(jwt.verify)(token, 'MY_JWT_SECRET');
    const current = (Date.now() - 1000) / 1000;
    const user = await User.findById(decoded.id);
    res.status(200).json({
        user,
        valid: current < decoded.exp
    });
});