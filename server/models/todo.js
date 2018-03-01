var mongoose = require('mongoose');

var Todo = mongoose.model('Todos', {
    text: {
        type: String,
        required:true,
        minlength:1,
        trim:true
    },
    completed: {
        type: Boolean,
        default:false
    },
    completedAt: {
        type: Number,
        default:null
    }
});



module.exports = {Todo};




// var newTodo = new Todo({
//     text: 'sample test'
// });


// newTodo.save().then((result) => {
//     console.log('Todos', result);
// }, (e) => {
//     console.log('Not able to add Todo');
// })


// var newTodo = new Todo({
//     error:false
// });

// //Throws error - since required field not there in object
// newTodo.save().then((result) => {
//     console.log('Todos', result);
// }, (e) => {
//     console.log('Not able to add Todo');
// })