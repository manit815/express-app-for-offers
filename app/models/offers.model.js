const mongoose = require('mongoose');

const INGOffersSchema = mongoose.Schema({
    offerDescription: String,
    offerName: String,
    merchantName: String,
    merchantId: String,
    categoryId: String,
    address: Object
}, {
    timestamps: true
});

module.exports = mongoose.model('INGOffers', INGOffersSchema);