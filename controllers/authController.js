const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const Email = require('../utils/email');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.login = catchAsync(async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) return next(new Error('Username or Password Incorrect'));
    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.comparePasswords(password, user.password))) return next(new Error('User not found'));

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
    const cookieOptions = { expires: new Date(Date.now() + 5 * 60 * 1000), httpOnly: true, secure: true };
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(200).json({
        message: 'Logged In Successfully',
        token,
        user
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];
    else if(req.cookies.jwt) token = req.cookies.jwt;

    if (!token) return next(new Error('The user is not logged in.'));

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return next(new Error('This token belongs to a different user'));
    if (await user.passwordChanged(decoded.iat)) return next(new Error('The user has changed their password'));

    req.user = user;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return next(new Error('Sorry you are not authorized to use this route'));
        next();
    }
}

exports.signUp = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    const cookieOptions = { expires: new Date(Date.now() - 5 * 60 * 60 * 1000), secure: true, httpOnly: true };
    user.password = undefined;

    res.cookie('jwt', token, cookieOptions);
    res.status(200).json({
        message: 'Signed Up Successfully',
        user,
        token
    });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return next(new Error('Sorry the email associated with this username does\'nt exist.'));
    
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const url = `${ req.protocol }://${ req.get('host') }/api/v1/users/resetPassword/${ resetToken }`;
    
    try {
        await new Email(user, url).send();
        res.status(200).json({
            message: 'Password reset link has been sent to your email. Please click the link to reset the password',
            resetToken
        });
    } catch (err) {
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;
        await user.save({ validateBeforeSave: false });
        next(err);
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: resetToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) return next(new Error('Token Invalid Or Expired'));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    const cookieOptions = { expires: new Date(Date.now() + (5 * 60 * 1000)), httpOnly: true, secure: true };
    res.cookie('jwt', token, cookieOptions);
    res.status(200).json({
        message: 'Password Changed Successfully',
        token        
    });
});

exports.logout = catchAsync(async (req, res, next) => {
    res.cookie('jwt', 'loggedout', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true, secure: true });
    res.status(200).json('Logged out successfully');
});