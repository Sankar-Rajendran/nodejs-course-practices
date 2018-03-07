const { ObjectID } = require('mongodb');


const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');



var id = '5a9fb784c099713fcbd8725b';

if (!ObjectID.isValid(id)) {
    return console.log('Invalid Id');
}

//Finds all the todos - returns Array

Todo.find({ _id: id }).then((todos) => {
    console.log('Find todos', todos);
});


//Finds all the todos - returns first Object

Todo.findOne({ _id: id }).then((todo) => {
    console.log('Find One todo', todo);
});



//Find by Id

Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log('Id not found');
    }
    console.log('Find By Id', todo);
}).catch((e) => {
    console.log(e)
});



