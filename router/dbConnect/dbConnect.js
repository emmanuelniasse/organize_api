const config = require('../../config/config.json');
const mongoose = require('mongoose');

const connect = async () => {
    try {
        await mongoose.connect(config.dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};

module.exports = { connect };
