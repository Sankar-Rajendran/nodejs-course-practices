const { ObjectID } = require('mongodb');


const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');


Todo.findOneAndRemove({ _id:'5aa10b254eb13a416934aaf8'}).then((results) => {
    console.log(results);
});


Todo.findByIdAndRemove('5a9fb784c099713fcbd8725b').then((results) => {
    console.log(results);
});



Todo.remove({}).then((results) => {
    console.log(results)
});