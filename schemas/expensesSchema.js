import mongoose from 'mongoose';
const { Schema } = mongoose;

const expensesSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'Users' },
        name: String,
        // category: { type: Schema.Types.ObjectId, ref: 'Categories' },
        sum: Number,
        description: String,
        slug: String,
    },
    { versionKey: false }
);

const Expenses = mongoose.model('Expenses', expensesSchema);

export default Expenses;
