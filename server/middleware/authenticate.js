var {User} = require('./../models/user')

//Middleware
var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            res.status(404).send({ error: true, message: 'User not found' })
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((err) => {
        res.status(401).send({ error: true, message: 'Invalid token' })
    });
}



module.exports = {authenticate}