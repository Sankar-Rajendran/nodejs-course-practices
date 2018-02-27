//const MongoClient = require('mongodb').MongoClient;


const { MongoClient, ObjectID } = require('mongodb');

console.log(new ObjectID());

MongoClient.connect("mongodb://localhost:27017/TodoApp", function (err, client) {
    if (err) {
        return console.log('Unable to connect now', err);
    }
    console.log('Mongodb connection success');

    const db = client.db('TodoApp');

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5a8d3b566274753fb6ac4acd')
    }, {
            $set: {
                complete: false
            }
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(JSON.stringify(result, undefined, 2))
        })


    //  client.close();


});