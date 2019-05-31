const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

mongoose.connect('mongodb+srv://jalal:jalal4488@mongo-learn-q9bs4.mongodb.net/test?retryWrites=true', {useNewUrlParser: true}, ()=>{
    console.log(`connected to mongo db`);
});


const Product = require('./api/routes/product');
const Order = require('./api/routes/order');
const User = require('./api/routes/user');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(bodyParser.json());


app.use('/products', Product);
app.use('/orders', Order);
app.use('/user', User)

app.use((req, res, next)=> {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
})
app.use((error, req, res, next)=>{
    res.status(error.status || 500)
    res.json({
        error:{
            message:error.message
        }
    })
})


const port = 4000;
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});