const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = express();
const path = require('path');

const Exercise = require('./models/exerciseModel');
const errorController = require('./errorController');
const catchAsync = require('./utils/catchAsync');
const mongoose = require('mongoose');
const exerciseRouter = require('./routes/exerciseRoutes');
const userRouter = require('./routes/userRoutes');

const ROOT_URL = 'https://exercisedb.p.rapidapi.com/exercises';

mongoose.connect(process.env.MONGODB_URL.replace('<password>', process.env.MONGODB_PASSWORD)).then(() => {
    console.log('Connected To Database');
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: 'https://health-cuisine.onrender.com'
}));

app.use('/api/v1/exercises', exerciseRouter);
app.use('/api/v1/users', userRouter);

app.patch('/createVipExercises', catchAsync(async (req, res, next) => {
    const bodyPart = await Exercise.find().select('bodyPart').distinct('bodyPart');
    const exercises = await Exercise.find({ bodyPart: bodyPart[0] });
    res.status(200).json({ message: 'In Process' });
}));

app.listen(3000, () => {
    console.log('Listening To Port 3000');
});

app.use(errorController);