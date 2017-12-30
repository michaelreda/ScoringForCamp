var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    type:{type:String},
    time: {type:Date},
    points:{type:Number, default: 0},
    admin:{type : mongoose.Schema.Types.ObjectId, ref: 'user'},
    user:{type : mongoose.Schema.Types.ObjectId, ref: 'user'}
})

  module.exports = Transaction;