const router = require('express').Router();
const {Customer,validate} = require('../models/customer');
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
            error: ex.message
        });
    }
});


router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
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

module.exports = router;