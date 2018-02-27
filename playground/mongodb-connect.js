//const MongoClient = require('mongodb').MongoClient;


const {MongoClient , ObjectID} = require('mongodb');

console.log(new ObjectID());

MongoClient.connect("mongodb://localhost:27017/TodoApp", function (err, client) {
    if (err) {
        return console.log('Unable to connect now', err);
    }
    console.log('Mongodb connection success');

    const db = client.db('TodoApp');

    db.collection('Users').insertOne({
        'Name':'Sankar Rajendran',
        'location':'Chennai'
    },(err,result) =>{
        if(err){
            return console.log('Unable to insert data');
        }
        console.log(JSON.stringify(result.ops,undefined,2));
    })

    client.close();


});