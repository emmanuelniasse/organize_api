import mongoose from 'mongoose';
const { Schema } = mongoose;

const categoriesSchema = new Schema(
    {
        name: String,
    },
    { versionKey: false }
);

const Categories = mongoose.model('Categories', categoriesSchema);

export default Categories;
