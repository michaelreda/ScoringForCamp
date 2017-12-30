var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    name:{type:String},
    ID: {type:Number},
    points:{type:Number, default: 0},
    admin:{type:Number, default: 0},
    attendance_dates:[],
    transactions:[{type : mongoose.Schema.Types.ObjectId, ref: 'transaction'}]
})

  var User = mongoose.model("user", Schema);

  module.exports = User;