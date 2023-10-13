const mongoose = require('mongoose');
const { Schema } = mongoose;

const expensesSchema = new Schema(
    {
        name: String,
        category: { type: Schema.Types.ObjectId, ref: 'Categories' },
        sum: Number,
        description: String,
        slug: String,
    },
    { versionKey: false }
);

const Expenses = mongoose.model('Expenses', expensesSchema);

module.exports = Expenses;
