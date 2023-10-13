const mongoose = require('mongoose');
const { Schema } = mongoose;

const categoriesSchema = new Schema(
    {
        name: String,
    },
    { versionKey: false }
);

const Categories = mongoose.model('Categories', categoriesSchema);

module.exports = Categories;
