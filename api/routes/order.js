const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const Product = require('../models/productModel')

router.get('/', (req, res, next)=>{
    Order.find()
    .select('_id quantity product')
    .populate('product', 'name _id')
    .exec()
    .then(docs=>{
        const response = {
            count:docs.length,
            products:docs.map(doc =>{
                return {
                    _id:doc._id,
                    quantity:doc.quantity,
                    product:doc.product,
                    request:{
                        type:"GET",
                        url :"http://localhost:4000/orders/"+doc._id
                    }
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});


router.post('/', (req, res, next)=>{
    Product.findById(req.body.product)
    .then(product =>{
        if(!product){
            return res.status(404).json({
                message:"product not found"
            })
        }
        const newOrder = new Order({
            quantity:req.body.quantity,
            product:req.body.product
        })
        return newOrder.save()
    })
    .then(order => {
        res.status(201).json({
            message: 'order successfully created',
            order:{
                _id:order._id,
                quantity:order.quantity,
                product:order.product,
                request:{
                    type:"GET",
                    url:"http://localhost:4000/orders/"+order._id
                }
            }
        });
    })
    .catch(err => {
       res.status(500).json({
           error:err
       })
    })
});


router.get('/:id', (req, res, next)=>{
    const id = req.params.id;
    Order.findById(id) 
    .select('_id quantity product')
    .populate('product')
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                message: "success",
                order:{
                    _id:doc._id,
                    quantity:doc.quantity,
                    price:doc.price,
                    request:{
                        type:"GET",
                        url:"http://localhost:4000/products"
                    }
                }
            })
        }else{
            res.status(404).json({
                message: "no data found against this id",
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
});


router.patch('/:id', (req, res, next)=>{
    const edit_id = req.params.id;
    const updateObj = {}
    for(const ops of req.body){
        updateObj[ops.name] = ops.value;
    }
   Product.update({_id:edit_id}, {$set: updateObj})
   .exec()
   .then(result=>{
       res.status(200).json(result)
   })
   .catch(err=>{
        res.status(500).json({
            error:err
        })
   })
});


router.delete('/:id', (req, res, next)=>{
    const del_id = req.params.id;   
    Order.remove({_id:del_id})
    .then(order=>{
        res.status(200).json({
            message: "deleted successfully",
            deleted : product
        })
    })
    .catch(err=>{
       res.status(500).json({
           error:err
       })
    })
});


module.exports = router;