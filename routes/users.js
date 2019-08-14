const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');


router.get('/me', auth, async(req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send({
        success: true,
        user: user
    });
});
router.post('/', async (req, res, next) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send({
            success: false,
            error: error.details[0].message
        });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send({
            success: false,
            message: 'User Already Registered with that email!'
        });
    }


    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin:req.body.isAdmin
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.getAuthToken();
    res.header('x-auth-token', token).status(200).send({
        success: true,
        message: 'User Registered Successfully',
        user: _.pick(user, ['name', 'email'])
    });
});

module.exports = router;