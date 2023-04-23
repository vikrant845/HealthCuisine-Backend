module.exports = (err, req, res, next) => {
    console.log(err);
    if (err.name === 'JsonWebTokenError') console.log('Not logged in');
    res.status(500).json({
        message: 'Oops An Error Occured',
        error: {
            message: err.message,
            stack: err.stack
        }
    });
}