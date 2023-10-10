const mongoose = require('mongoose');
const { Schema } = mongoose;

const expensesSchema = new Schema(
    {
        name: String,
        sum: Number,
        slug: String,
    },
    { versionKey: false }
);

const Expenses = mongoose.model('Expenses', expensesSchema);

module.exports = Expenses;
