const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const checkAUth = require('../middleware/check-auth');

router.get('/',checkAUth, (req, res, next)=>{
    Product.find()
    .select('_id name price')
    .exec()
    .then(docs=>{
        const response = {
            count:docs.length,
            products:docs.map(doc =>{
                return {
                    _id:doc._id,
                    name:doc.name,
                    price:doc.price,
                    request:{
                        type:"GET",
                        url :"http://localhost:4000/products/"+doc._id
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


router.post('/', checkAUth, (req, res, next)=>{
    const newProduct = new Product({
        name:req.body.name,
        price:req.body.price
    })
    newProduct.save()
    .then(product => {
        res.status(201).json({
            message: 'product successfully save to database',
            product:{
                _id:product._id,
                name:product.name,
                price:product.price,
                request:{
                    type:"GET",
                    url:"http://localhost:4000/products/"+product._id
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
    Product.findById(id) 
    .select('_id name price')
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                message: "success",
                product:{
                    _id:doc._id,
                    name:doc.name,
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


router.delete('/:id',checkAUth, (req, res, next)=>{
    const del_id = req.params.id;   
    Product.remove({_id:del_id})
    .then(product=>{
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