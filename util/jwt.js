const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generate a jwt for a user
 * @param user
 */
function generateToken(user) {
    let u = {
        username: user.username,
        images: user.images,
    };

    // Return the JWT Token
    return jwt.sign(u, process.env.JWT_SECRET, {
        expiresIn: 7 * 60 * 60 * 24 // expires in 1 week
    });
}
  
/**
 * Verify a jwt
 * @param token - the jwt to verify 
 */
async function verify(token) {
    return new Promise( (resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) reject(err);
            resolve(user);
        });
    })
}

module.exports = {
    generateToken,
    verify
}