// Need values from env variables
/* eslint-disable no-process-env */

const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Generate a jwt for a user
 * @param user
 */
export function generateToken(user: any) {
  const userInfo = {
    username: user.username,
    images: user.images,
  };

  // Return the JWT Token
  return jwt.sign(userInfo, process.env.JWT_SECRET, {
    // expires in 1 week
    expiresIn: 7 * 60 * 60 * 24,
  });
}

/**
 * Verify a jwt
 * @param token - the jwt to verify
 */
export async function verify(token: any): Promise<any> {
  return await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
      if (err) reject(err);
      resolve(user);
    });
  });
}
