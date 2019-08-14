const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config'); //enviornment variable
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required:true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    isAdmin : Boolean
});

userSchema.methods.getAuthToken = function () {
    return  jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get('jwtPrivateKey'));
}
const User = mongoose.model('User',userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.required()

    }
    return Joi.validate(user,schema);
}

module.exports.User = User;
module.exports.validate = validateUser;