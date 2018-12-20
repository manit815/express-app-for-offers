const mongoose = require('mongoose');
const offers = require('./offers.model.js');

const INGCategoriesSchema = mongoose.Schema({
    categoryId: String,
    categoryName: String,
    description: String,
    details: Array
}, {
    timestamps: true
});

module.exports = mongoose.model('INGCategories', INGCategoriesSchema);