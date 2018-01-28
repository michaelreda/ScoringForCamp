var gzippo = require('gzippo');
var express = require('express');
var app = express();
var morgan = require('morgan');
var logger = morgan('combined');
var fs = require('fs');
var cors = require('cors');
//app.use(gzippo.staticGzip("" + __dirname + "/dist"));
var path = require('path');
var serveStatic = require('serve-static');
var indexHtml = 'index.html';
var serve = serveStatic(path.resolve('build'), {
    index: indexHtml, //forces invalidation of cached 'index.html'
    setHeaders: setCustomCacheControl
    // cacheControl: true, //default is true
    // lastModified: true, //default is true
    // etag: true, //default is true
});
function setCustomCacheControl(res, myPath, stat) {
    if (path.parse(myPath).base == indexHtml) {
        //browser must contact the server before
        //serving a cached 'index.html'
        res.setHeader('Cache-Control', 'public, no-cache');
    } else {
        //for all other files, cache for a long duration,
        //and force cache invalidation using gulp-rev
        var dur_in_ms = 2 * 24 * 60 * 60 * 1000; //2 days
        res.setHeader('Cache-Control', 'public, max-age=' + dur_in_ms);
    }
}
app.use(serve);
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });
app.use(morgan({ combinedstream: accessLogStream }));
app.listen(process.env.PORT || 5000);
app.use(cors());
console.log("app started");

var mongoose = require('mongoose');
var DB_URI = "mongodb://admin:admin@ds211088.mlab.com:11088/rosolcampscoring";
var bodyParser = require('body-parser');
// app.use(express.static('../public'))
// var Router = express.Router();
app.use(bodyParser.urlencoded({ extended: false })); //this line must be on top of app config
app.use(bodyParser.json());

mongoose.connect(DB_URI, function (err) {
    if (!err) {
        console.log("connected to global db..");
    } else {
        console.log("error");
    }
});



app.options('/*', function (req, res) {
    return res.sendStatus(200);
});



var Team = require("./server/Models/Team");
var Item = require("./server/Models/Item");

// app.get('/', function (req, res) {
//     res.render('index.html');
// });

app.post('/add_team', function (req, res) {
    console.log(req.body);
    var team = new Team(req.body.team);
    team.save(function (err, team) {
        if (err)
            res.send(err);
        else {
            res.send("team added successfully");
        }
    })
});



app.post('/define_item', function (req, res) {
    console.log(req.body);
    var item = new Item(req.body.item);
    item.save(function (err, item) {
        if (err)
            res.send(err);
        else {
            res.send("item added successfully");
        }
    })
});

app.post('/add_points', function (req, res) {
    console.log(req.body);
    Team.updateOne({_id:req.body.team_id},{$inc:{points:req.body.points,total_points:req.body.points}},function(err,team){
        if(err){
            console.log(err);
            res.send("Error occurred try again!");
        }else{
            //Team.findOne({_id:req.body.team_id},function(err,team){res.send(team);});
            res.send(req.body.points + " points added successfully");
        }
    })
});

app.post('/add_item',function(req,res){

    Team.findOne({"_id":req.body.team_id}).populate('items').exec(function(err,team){
        if(err){
            console.log(err);
            res.send(err);
        }else{
            var team_item=null;
            var item_index=-1;
            //check if this item already owned by the team
            for(var i=0;i<team.items.length;i++){
                if(team.items[i].item._id==req.body.item._id){
                    team_item = team.items[i];
                    item_index= i;
                    break;
                }
            }
            if(team_item !=null){//if it's the first time to own this item
                //check if we can add the item again
                if(team_item.count<req.body.item.max_number){
                    
                      buy_item(team,item_index,req.body.item);
                }else{
                   return res.send("max number of "+req.body.item.title+" reached ("+req.body.item.max_number+"). can not add this item again");
                }
            }else{
                buy_item(team,item_index,req.body.item);
            }
            
        }

        function buy_item(team,item_index,requested_item){
           // console.log('team,item_index,requested_item: ', team,item_index,requested_item);

            var now = Date.now();
            //check if the team have enough points to purchase this item
            if(team.points>=requested_item.price){
                //if not first time
                if(item_index != -1){
                    Team.findOne({_id:team._id},function(err,team){
                        if(err){
                            console.log(err);
                            return finish_purchase(err);
                        }else{
                            team.items[item_index].count++;
                            team.points-=requested_item.price;
                            team.items[item_index].date= now;
                            team.save((err,team)=>{
                                return finish_purchase(true);  
                            });
                        }  
                    })
                }else{//if first time
                    var points = team.points - requested_item.price;
                    Team.updateOne({_id:team._id},{$push:{"items":{item:requested_item._id,count:1,date:now}},"points":points},function(err){
                        if(err){
                            console.log(err);
                            return finish_purchase(err);
                        }else
                           return finish_purchase(true);    
                    })
                }
            }else{
                return finish_purchase("Not enough points.. you have "+team.points+" points and "+requested_item.title+"'s price is "+requested_item.price);
                
            }
           
        }


        function finish_purchase (result){
            if(result==true){
                Team.findOne({_id:req.body.team_id}).populate('items').exec(function(err,team){
                    if(err){
                        console.log(err);
                        return res.send(err);
                    }                        
                    else
                        return res.send(req.body.item.title+" added successfully")//res.send(team);    
                });
            }else{
                 return res.send(result);
            }
        }

    })
})

app.post('/new_transaction', function (req, res) {
    console.log(req.body);
    var transaction = new Transaction(req.body);
    transaction.time = Date.now();
    transaction.save(function (err, transaction) {
        if (err)
            res.send(err);
        else {
            console.log(req.body.user);
            User.updateOne({ "ID": req.body.user }, { $inc: { "points": req.body.points }, $push: { "transactions": transaction._id } }, (err, user) => {
                if (err)
                    console.log(err);
                else {
                    //add the transaction for the admin
                    User.updateOne({ "ID": req.body.admin }, { $push: { "transactions": transaction._id } }, (err, admin) => { });
                    res.send("done");
                }
            })
        }
    })
});

app.get('/get_transactions/:ID', function (req, res) {
    console.log(req.params);
    User.findOne({ "ID": req.params.ID }).populate("transactions").exec(function (err, user) {
        if (err)
            console.log(err);
        else
            res.send(user);
    })
});


app.get('/get_teams', function (req, res) {
    Team.find({}).sort('name').exec(function(err,teams){
      res.send(teams);
  })
});

app.get('/get_items', function (req, res) {
    Item.find({},function(err,items){
      res.send(items);
  })
});