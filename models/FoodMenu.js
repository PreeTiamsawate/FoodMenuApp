const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FoodMenuSchema = new Schema({
    name: {
        type: String
    },
    type:{
        type: String
    },
    price: {
        type: Number
    },
    promotion: {
        type: Boolean
    },
    promotionPrice: {
        type: Number
    },
    promotionDetail: {
        type: String
    },
    imgName:{
        type: String
    }
}, {
    collection: 'foodMenu'
});

module.exports = mongoose.model('FoodMenu', FoodMenuSchema);