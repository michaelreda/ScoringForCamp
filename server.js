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
var indexHtml = 'src/index.html';
var serve = serveStatic(path.resolve('dist'), {
    index: indexHtml, //forces invalidation of cached 'index.html'
    setHeaders: setCustomCacheControl,
    // cacheControl: true, //default is true
    // lastModified: true, //default is true
    // etag: true, //default is true
})
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
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' })
app.use(morgan({ combinedstream: accessLogStream }));
app.listen(process.env.PORT || 5000);
app.use(cors());
console.log("app started");

var mongoose = require('mongoose');
var DB_URI = "mongodb://admin:admin@ds133597.mlab.com:33597/qr_attendance";
var bodyParser = require('body-parser');
// app.use(express.static('../public'))
// var Router = express.Router();
app.use(bodyParser.urlencoded({ extended: false })); //this line must be on top of app config
app.use(bodyParser.json());

mongoose.connect(DB_URI,function(err){
    if(!err){
        console.log("connected to global db..");
    }else{
        console.log("error");
    }
});



app.options('/*', function (req, res) {
    return res.sendStatus(200);
});



var User = require("./server/Models/User");
var Transaction = require("./server/Models/Transaction");

app.get('/', function (req, res) {
    res.send("hi, this is the server");
});

app.post('/add_user', function (req, res) {
    console.log(req.body);
    var user = new User(req.body.user);
    user.save(function (err, user) {
        if (err)
            res.send(err);
        else {
            res.send("user added successfully");
        }
    })
});

app.post('/new_transaction', function (req, res) {
    console.log(req.body);
    var transaction = new Transaction(req.body);
    transaction.save(function (err, transaction) {
        if (err)
            res.send(err);
        else {
            console.log(req.body.user);
            User.updateOne({ "ID": req.body.user }, {$inc:{"points":req.body.points}, $push: { "transactions": transaction._id } }, (err, user) => {
                if(err)
                    console.log(err);
                else{
                    //add the transaction for the admin
                    User.updateOne({ "ID": req.body.admin }, {$push: { "transactions": transaction._id } }, (err, admin)=>{}); 
                    res.send("done");
                }
            })
        }
    })
});

app.get('/get_transactions/:ID', function (req, res) {
    console.log(req.params);
    User.findOne({"ID":req.params.ID}).populate("transactions").exec(function(err,user){
        if(err)
            console.log(err);
        else
            res.send(user);    
    })
});