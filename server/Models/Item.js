var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    title:{type:String},
    price: {type:Number},
    max_number:{type:Number, default: 1},
    img:{type : String},
})

var Item = mongoose.model("item", Schema);
  module.exports = Item;