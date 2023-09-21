const mongoose = require('mongoose');
const { Schema } = mongoose;

const subcategoriesSchema = new Schema({
    name: String,
    slug: String,
    category: String,
});

const Subcategories = mongoose.model(
    'Subcategories',
    subcategoriesSchema
);

module.exports = Subcategories;
