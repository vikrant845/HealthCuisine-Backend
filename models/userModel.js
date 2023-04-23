const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Firstname Required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Lastname Required'],
        trim: true
    },
    maidenName: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: [18, 'Minimum age should be 18']
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'Won\'t Disclose']
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, 'Please Enter An Email'],
        validate: [validator.isEmail, 'Email should be valid']
    },
    phone: {
        type: String,
        required: true
    },
    username: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    passwordConfirm: {
        type: String,
        validate: {
            validator: function(el) {
                return this.password === el;
            },
            message: 'Passwords Must Match'
        }
    },
    passwordChangedAt: {
        type: Date
    },
    birthDate: {
        type: Date,
        default: new Date('1998-07-15')
    },
    image: String,
    bloodGroup: {
        type: String,
        required: true
    },
    height: Number,
    weight: Number,
    ip: String,
    address: {
        address: String,
        city: String,
        coordinates: {
            lat: Number,
            lng: Number
        },
        postalCode: String,
        state: String
    },
    bank: {
        cardExpires: String,
        cardNumber: String,
        cardType: String,
        currency: String,
        iban: String
    },
    ssn: String,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    likedWorkouts: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Exercise',
        unique: true
    },
    ongoingWorkouts: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Exercise',
        unique: true
    },
    goal: {
        type: Number,
        min: [ 0, 'The goal should be minimum 0%' ],
        max: [ 100, 'The goal should be maximum 100%' ],
        default: 0
    },
    passwordResetExpires: Date,
    passwordResetToken: String
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.passwordChanged = async function(loginTimestamp) {
    if (this.passwordChangedAt) {
        const timeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return timeStamp > loginTimestamp;
    }
    return false;
}

userSchema.methods.comparePasswords = async function(password, originalPassword) {
    return await bcrypt.compare(password, originalPassword);
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + (10 * 60 * 1000);
    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;