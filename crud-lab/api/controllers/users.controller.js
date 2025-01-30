const createError = require('http-erros'); 
const User = require ('../models/user.model'); 

module.exports.create = (req, res, next) => {
    const { email } = req.body; 
    User.findOne ({ email })
        .then((user) => {
            if (user) {
                next (createError(400, { message: 'User email is already taken', errors: {email: 'Already exists'} })); 
            } else {
                return User.create(req.body)
                    .then ((user) => res.status(201).json(user))
            }
        })
        .catch ((error) => next (error))
}