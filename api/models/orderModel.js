const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    product:{type:mongoose.Types.ObjectId, ref:'products'},
    quantity:{type:Number, default:1}
});

module.exports = mongoose.model('orders', orderSchema);