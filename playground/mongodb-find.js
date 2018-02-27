//const MongoClient = require('mongodb').MongoClient;


const { MongoClient, ObjectID } = require('mongodb');

console.log(new ObjectID());

MongoClient.connect("mongodb://localhost:27017/TodoApp", function (err, client) {
    if (err) {
        return console.log('Unable to connect now', err);
    }
    console.log('Mongodb connection success');

    const db = client.db('TodoApp');

    // db.collection('Todos').find().toArray().then((docs) => {
    //     console.log(JSON.stringify(docs, undefined, 2));
    // });


    // db.collection('Todos').find({ completed: true }).toArray().then((docs) => {
    //     console.log(JSON.stringify(docs, undefined, 2));
    // })


    db.collection('Users').find({ location: 'Chennai' }).count().then((count) => {
        console.log(`Users Count is : ${count}`);
    })


    db.collection('Users').find({ location: 'Chennai' }).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    })



    //  client.close();


});