const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/TodoApp');


var Todo = mongoose.model('Todos', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});


var newTodo = new Todo({
    text: 'sample test'
});


newTodo.save().then((result) => {
    console.log('Todos', result);
}, (e) => {
    console.log('Not able to add Todo');
})



var newTodo = new Todo({
    error:false
});


newTodo.save().then((result) => {
    console.log('Todos', result);
}, (e) => {
    console.log('Not able to add Todo');
})