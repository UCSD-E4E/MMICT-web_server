const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generate a jwt for a user
 * @param user
 */
export function generateToken(user: any) {
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
export async function verify(token: any) : Promise<any> {
    return new Promise( (resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
            if (err) reject(err);
            resolve(user);
        });
    })
}