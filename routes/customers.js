const errors = require('restify-errors')
const Customer = require('../models/Customer')

module.exports = server => {
    
    // GET Customers
    server.get('/customers', async (req, res, next) => {
        
        try {
            const customers = await Customer.find({});
            res.send(customers);
            next();
        } catch(err) {
            return next(new errors.InvalidContentError(err.message))
        }
        
    })

   // GET Single Customer
    server.get('/customers/:id', async (req, res, next) => {
        
        try {
            const customer = await Customer.findById(req.params.id);
            res.send(customer);
            next();
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no customer has id is ${req.params.id}`))
        }
        
    })
    
    // UPDATE Single Customer
     server.put('/customers/:id', async (req, res, next) => {
        
        // Check for JSON passed
        if(!req.is('application/json'))
        {
            return next(new errors.InvalidArgumentError("Expects 'application/json'"));
        }

        // Save to db
        try {
            const customer = await Customer.findOneAndUpdate({_id: req.params.id}, req.body);
            res.send(201);
            next();
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no customer has id is ${req.params.id}`))
        }
    })

    // DELETE Single Customer
    server.del('/customers/:id', async (req, res, next) => {
                
        // Save to db
        try {
            const customer = await Customer.findOneAndRemove({_id: req.params.id});
            res.send(204);
            next();
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no customer has id is ${req.params.id}`))
        }
    })

    // ADD Customer
    server.post('/customers', async (req, res, next) => {
        
        // Check for JSON passed
        if(!req.is('application/json'))
        {
            return next(new errors.InvalidArgumentError("Expects 'application/json'"));
        }

        // Create new customer object based on passed parameters
        const {name, email, balance} = req.body;        
        const customer = new Customer({
            name,
            email,
            balance
        });

        // Save to db
        try {
            const newCustomers = await customer.save();
            res.send(201);
            next();
        } catch(err) {
            return next(new errors.InternalError(err.message))
        }
    })
}