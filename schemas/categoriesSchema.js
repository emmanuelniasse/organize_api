const mongoose = require('mongoose');
const { Schema } = mongoose;

const categoriesSchema = new Schema(
    {
        name: String,
        slug: String,
    },
    { versionKey: false }
);

const Categories = mongoose.model('Categories', categoriesSchema);

module.exports = Categories;
