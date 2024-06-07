const jwt = require('jsonwebtoken');
require('dotenv').config();

async function verifyUser(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.USER_KEY, (err, authData) => {
            if (err) {
                reject(403); 
            } else {
                resolve(authData); 
            }
        });
    });
}

module.exports = verifyUser;