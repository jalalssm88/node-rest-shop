const express = require('express');
const router = express.Router();
const bycrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length >=1){
            return res.status(409).json({
                message:"user already exist"
            })
        }else{
            bycrypt.hash(req.body.password, 10,(err, hash)=>{
                if(err){
                    return res.status(500).json({
                        error:err
                    })
                }else{
                    const newUser = new User({
                        email:req.body.email,
                        password: hash
                    })
                    newUser.save()
                    .then(result => {
                        res.status(201).json({
                            message:"user has successfully created",
                        })
                    })
                    .catch(err=>{
                        res.status(500).json({
                            error:err
                        })
                    })
                }
            })
        }
    })
})

router.post('/login', (req, res, next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(401).json({
                message:"eamil to try to login not found"
            })
        }
        bycrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if(err){
                return res.status(401).json({
                    message:"Auth failed"
                })
            }
            if(result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                },
                    'secret'
                );
                return res.status(200).json({
                    message: "Auth successful",
                    token:token
                })
            }
            res.status(401).json({
                message:"Password does not match"
            })
        })
    })
    .catch(err =>{
        res.status(500).json({
            error:err
        })
    })
})

router.get('/', (req, res)=>{
    User.find()
    .select('_id email password')
    .then(user=>{
        res.status(200).json({
            users:user
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

router.delete('/:id', (req, res, next)=>{
    const del_id = req.params.id;   
    User.remove({_id:del_id})
    .then(user=>{
        res.status(200).json({
            message: "deleted successfully",
            deleted : user
        })
    })
    .catch(err=>{
       res.status(500).json({
           error:err
       })
    })
});



module.exports = router;