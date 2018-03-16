const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');


const userOneId = new ObjectId(1);
const userTwoId = new ObjectId(2);


const users = [{
    _id: userOneId,
    email: 'sankar@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
    }]

}, {
    _id: userTwoId,
    email: 'sankar123@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth' }, 'abc123').toString()
    }]
}];


const populateUsers = (done) => {
    User.remove({}).then(() => {
        //Why we are not using insertmany is  to hash the password before save
        var userOne = new User(users[0]).save();

        return userOne.then(() => {
            var userTwo = new User(users[1]).save().then(() => {
                done();
            });
        })
    })
}


const todos = [{
    _id: new ObjectId(),
    text: 'First test todo',
    _creator: userOneId
}, {
    _id: new ObjectId(),
    text: 'Second test todo',
    completed: true,
    complatedAt: 333,
    _creator: userTwoId
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => { done() });
}


module.exports = { todos, populateTodos, users, populateUsers }