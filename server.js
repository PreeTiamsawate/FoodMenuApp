const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const database = require('./database');
const createError = require('http-errors');
require('dotenv').config();
const path = require('path')

//Connect to Database naka
mongoose.Promise = global.Promise;
mongoose.connect(database.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('Database connected successfully !');
}, error => {
    console.log('Cannot connect to database'+error)
});
mongoose.set('useFindAndModify', false);

const foodAPI = require('./routes/api/food.route');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());// cross server between port 8080 and 4000
app.use(express.static('static'));
// app.use(express.static(__dirname+'/client/public/'));

//API connect to routes
app.use('/api', foodAPI);

//CREATE PORT
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('Connected to port' + port)
});

// 404 Handler
app.use((req, res, next)=>{
    next(createError(404))  
})

//error handler
app.use(function(err, req, res, next){
    console.error(err.message);
    if(!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message)
})
