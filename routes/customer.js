const mongoose = require('mongoose');
const Joi = require('joi');
const router = require('express').Router();

const customersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    isGold: {
        type: Boolean,
        required: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Customer = mongoose.model('Customer', customersSchema);

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find({}).sort('name');
        res.status(200).send({
            success: true,
            result: customers,
            message: 'list of customers'
        });
    } catch (ex) {
        res.status(500).send({
            success: false,
            message: 'Could not get results check errors',
            error: ex
        });
    }
});


router.post('/', async (req, res) => {
    try {
        const { error } = validateCustomer(req.body);
        if (error) {
            return res.status(400).send({
                success: false,
                message: 'could not post check error',
                error: error
            });
        }
        else {
            let customer = new Customer({
                name: req.body.name,
                isGold: req.body.isGold,
                phone: req.body.phone
            });
            console.log(customer);
            customer = await customer.save();
            res.status(200).send({
                success: true,
                result: customer,
                message: "successfully posted!"
            });
        }
    }
    catch (ex) {
        return res.send({
            success: false,
            message: 'could not post check error',
            error: ex.message
        }).status(500);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const customer = await Customer.findByIdAndRemove(req.params.id);
        if (!customer) {
            return res.status(200).send({
                success: false,
                message: 'Could not find with that id so document not deleted'
            });
        } else {
            res.status(200).send({
                success: true,
                message: 'successfully deleted document with that id'
            });
        }
    } catch (ex) {
        return res.status(500).send({
            success: false,
            message: 'could not deleted',
            error: ex.message
        });
    }
});


function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean().required(),
        phone: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(customer, schema);
}


module.exports = router;