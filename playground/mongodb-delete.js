//const MongoClient = require('mongodb').MongoClient;


const { MongoClient, ObjectID } = require('mongodb');

console.log(new ObjectID());

MongoClient.connect("mongodb://localhost:27017/TodoApp", function (err, client) {
    if (err) {
        return console.log('Unable to connect now', err);
    }
    console.log('Mongodb connection success');

    const db = client.db('TodoApp');

    //Delete many
    // db.collection('Todos').deleteMany({ name: 'eat lunch' }).then((result) => {
    //     console.log(JSON.stringify(result, undefined, 2));
    // });


    //Delete one
    // db.collection('Todos').deleteOne({ name: 'eat lunch' }).then((result) => {
    //     console.log(JSON.stringify(result, undefined, 2));
    // });

    //Findoneanddelete
    // db.collection('Todos').findOneAndDelete({ completed: false }).then((result) => {
    //     console.log(JSON.stringify(result, undefined, 2));
    // });



    db.collection('Todos').findOneAndDelete({ _id:new ObjectID('5a8d3b9a8c011a3fcda1a4e9') }).then((result) => {
        console.log(JSON.stringify(result, undefined, 2));
    });



    //  client.close();


});