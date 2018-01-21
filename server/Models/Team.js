var mongoose = require('mongoose');

var Schema = mongoose.Schema({
    name:{type:String},
    points:{type:Number, default: 0},
    total_points:{type:Number, default: 0},
    items:[{
      item:{type : mongoose.Schema.Types.ObjectId, ref: 'item'},
      date:{type: Date},
      count:{type: Number}
    }]
})

  var Team = mongoose.model("team", Schema);

  module.exports = Team;