var express= require('express');
var bcrypt=require('bcrypt');
var mongoose= require('mongoose');
var jwt= require('jsonwebtoken');
var bodyparser= require('body-parser');
var cors= require('cors');
var Organiser= require('./organiser');
var Event= require('./event');

const app= express();

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended:true
}));
app.use(express.static('public'));
app.use(express.static('public/css'));


const dburl= process.env.DATABASEURL;
mongoose.connect(dburl);
var port=process.env.PORT;

app.listen(port, function(){
    console.log("Application has been started at port: ", port);
})

app.get("/events",checkauth,(req,res,next)=>{
    Event.find({}).exec(function(err,events){
        if (err){
            console.log(err);
            res.send("error occured. check console for details");              
        }
        else{
            console.log("events found");
            res.json(events);
        }
    });
});

app.get("/events/:id",checkauth,(req,res,next)=>{
    Event.findOne({_id:req.params.id}).exec(function(err,event){
        if (err){
            console.log(err);
            res.send("error occured. check console for details");              
        }
        else{
            console.log("events found");
            res.json(event);
        }
    });
});


app.post("/events",checkauth,(req,res,next)=>{
    var newevent= new Events();
    newevent.id=req.body.id;
    newevent.name=req.body.name;
    newevent.description=req.body.description;
    newevent.date=req.body.date;
    newevent.time=req.body.time;
    newevent.duration=req.body.duration;
    newevent.organiser=req.body.organiser;
    
    newevent.save().exec(function(err,events){
        if (err){
            console.log(err);
            res.send("error occured. check console for details");              
        }
        else{
            console.log("events found");
            res.json(events);
        }
    });
});

app.post("/login", (req, res, next) => {
    Organiser.findOne({_id: req.body.email })
        .exec()
        .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: "Mail exists"
            });
        } 
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new Employee({
                        _id: req.body.email,
                        password: hash,
                        name: req.body.name
                    });
                    user.save()
                        .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "User created"
                        });
                    })
                        .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    });
});



app.post("/login", (req, res, next) => {
    Organiser.find({ email: req.body.email })
        .exec()
        .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            if (result) {
                const token = jwt.sign({
                    email: user[0].email
                },
                process.env.JWT_KEY,{
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    message: "Auth successful",
                    token: token,
                    username: user[0].name,
                    userId: user[0]._id
                });
            }
            res.status(401).json({
                message: "Auth failed !!!7"
            });
        });
    })
        .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});