const jwt = require('jsonwebtoken');

var data = {
    id : 4
};


//123abc - secret key
var token = jwt.sign(data,'123abc');


console.log(token);



var decoded = jwt.verify(token ,'123abc' );

console.log(decoded);