var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    type:{type:String},
    time: {type:Date},
    points:{type:Number, default: 0},
    admin:{type : String},
    user:{type : Number, ref: 'user'}
})

var Transaction = mongoose.model("transaction", Schema);
  module.exports = Transaction;