const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Joi = require('Joi');
const {User} = require('../models/user');

router.post('/',async(req,res)=>{
    const {error} = validate(req.body);
    if(error) {
        return res.status(400).send({
            success : false,
            error : error.details[0].message
        });
    }

    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return res.status(400).send({
            success: false,
            message : 'Invalid Email or Password!'
        });
    }
    else{
        const validPassword = await bcrypt.compare(req.body.password,user.password);
        if(!validPassword) {
            return res.status(400).send({
                success: false,
                message : 'Invalid Email or Password!'
            }); 
        }
        else {
            const token = user.getAuthToken();

            res.status(200).send({
                success : true,
                message : 'login successfully!',
                token: token
            });
        }
    }

});

function validate(req) {
    let schema = {
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(255).required()
    }

    return Joi.validate(req,schema);
}




module.exports = router;