const { verify } = require('../util/jwt');
const { Unauthorized } = require('../error/index');

const requireAuth = (
  req,
  res,
  next
) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return next(new Unauthorized('Missing auth token'));
  }

  const authHead = authHeader.split(' ');

  const invalidAuthFormat =
    authHead.length !== 2 ||
    authHead[0] !== 'Bearer' ||
    authHead[1].length === 0;

  if (invalidAuthFormat) {
    return next(new Unauthorized('Invalid auth token format'));
  }

  verify(authHead[1])
    .then((data) => {
      req.user = data;
      next();
    })
    .catch((err) => {
      //checks if jwt is malformed
      if (err.message.includes('invalid signature')) {
        err = new Unauthorized('Malformed JWT');
      }
      next(err);
    });
};

module.exports = {
  requireAuth
};