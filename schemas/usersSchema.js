const mongoose = require('mongoose');
const { Schema } = mongoose;

const usersSchema = new Schema(
    {
        pseudo: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        // expenses: object ..
    },
    { versionKey: false }
);

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;
