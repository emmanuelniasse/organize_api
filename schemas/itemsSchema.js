const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemsSchema = new Schema({
    name: String,
    slug: String,
    category: String,
    subcategory: String,
});

const Items = mongoose.model('Items', ItemsSchema);

module.exports = Items;
