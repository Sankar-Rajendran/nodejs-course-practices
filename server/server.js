const _ = require('lodash');
const config = require('./config/config.js');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');


var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate')



var app = express();

const port = process.env.PORT;


var validateObjectId = function (id) {
    if (!ObjectId.isValid(id)) {
        res.status(404).send({ error: true, message: 'invlid Id' })
        return false;
    }
    return true;
}

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({ text: req.body.text });

    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos })
    }, (err) => {
        res.status(400).send(err);
    })
});


app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send({ error: true, message: 'invlid Id' });
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({ message: "No Data found" });
        }
        res.status(200).send({ todo: todo })
    }).catch((err) => {
        res.status(400).send(err);
    })
})




app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(404).send({ error: true, message: 'invlid Id' });
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({ message: 'No doc found' })
        }
        res.status(200).send({ todo: todo })
    }).catch((e) => {
        res.status(400).send(e);
    })
});





app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectId.isValid(id)) {
        return res.status(404).send({ error: true, message: 'invlid Id' });
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send({ error: true, msg: 'data not found' });
        }
        return res.status(200).send({ todo })
    }).catch((e) => {
        return res.status(400).send({ error: true, msg: 'Error updating the id' });
    });
})


//User Routes
app.post('/users', (req, res) => {
    var userProps = _.pick(req.body, ['email', 'password']);
    var user = new User(userProps);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
})


app.get('/users/me', authenticate, (req, res) => {
    // var token = req.header('x-auth');

    // User.findByToken(token).then((user) => {
    //     if (!user) {
    //         res.status(400).send({ error: true, message: 'User not found' })
    //     }
    //     return res.send(user);
    // }).catch((err) => {
    //     res.status(401).send({ error: true, message: 'Invalid token' })
    // });


    res.send(req.user);
})


app.post('/users/login', (req, res) => {
    var userProps = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(userProps.email, userProps.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    }).catch((err) => {
        res.status(400).send({})
    })

})



app.listen(port, () => {
    console.log('Server starts listening on port' + port);
});



module.exports = { app };