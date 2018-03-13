const { SHA256 } = require('crypto-js');
const bcrypt = require('bcryptjs');



var password = '123abc';

//10 - Number of rounds want to use generate salt
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    })
})



var hashedPassword = '$2a$10$oEZDUNHThgfXiVOFyKLdlecUxCh9fKyBxYdHvnDRuHc8gMI4xnco6';


bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
})


var message = 'I am user number 24';

var hash = SHA256(message).toString();

console.log('Message: ' + message);

console.log('Hash ' + hash);


var data = {
    id: 4
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}


// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();


var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if (resultHash === token.hash) {
    console.log('Data was not changed')
} else {
    console.log('Data has changed.Do not trust..!!!')
}





