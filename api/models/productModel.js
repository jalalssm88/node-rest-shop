const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:String,
    price:{type:Number, required:true}
});

module.exports = mongoose.model('products', productSchema);