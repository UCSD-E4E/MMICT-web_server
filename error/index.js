/**
 * This file defines error classes based on their semantic meaning. It abstracts away
 * HTTP status codes so they can be used in a RESTful way without worrying about a
 * consistent error interface.
 *
 * These classes descend from the base Error class, so they also automatically capture
 * stack traces--useful for debugging.
 */

/**
 * Base error class.
 *
 * Supports HTTP status codes and a custom message.
 * From the ACM Membership Portal Backend repository
 */
class HttpError extends Error {
  status;
  constructor(name, status, message) {
    if (message === undefined) {
      message = status;
      status = name;
      name = undefined;
    }

    super(message);

    this.name = name || this.constructor.name;
    this.status = status;
    this.message = message;
  }
}

class UserError extends HttpError {
  constructor(message) {
    super(200, message || 'User Error');
  }
}

class BadRequest extends HttpError {
  constructor(message) {
    super(400, message || 'Bad Request');
  }
}

class Unauthorized extends HttpError {
  constructor(message) {
    super(401, message || 'Unauthorized');
  }
}

class Forbidden extends HttpError {
  constructor(message) {
    super(403, message || 'Permission denied');
  }
}

class NotFound extends HttpError {
  constructor(message) {
    super(404, message || 'Resource not found');
  }
}

class Conflict extends HttpError {
  constructor(message) {
    super(409, message || 'Conflict');
  }
}

class Unprocessable extends HttpError {
  constructor(message) {
    super(422, message || 'Unprocessable request');
  }
}

class InternalServerError extends HttpError {
  constructor(message) {
    super(500, message || 'Internal server error');
  }
}

class NotImplemented extends HttpError {
  constructor(message) {
    super(501, message || 'Not Implemented');
  }
}

/**
 * General error handling middleware. Attaches to Express so that throwing or calling next() with
 * an error ends up here and all errors are handled uniformly.
 */
const errorHandler = (
  err,
  req,
  res,
  next
) => {
  if (!err)
    err = new InternalServerError(
      'An unknown error occurred in the errorHandler'
    );
  if (!err.status) err = new InternalServerError(err.message);
  if (err.status >= 500) {
    console.error(`${err.status}`, err);
  } else {
    // otherwise just log the error message at the warning level
    console.warn(`${err.status}: ${err.message}`);
  }
  res.status(err.status).json({
    error: {
      status: err.status,
      message: `${err.message}`,
    },
  });
};

module.exports = {
    errorHandler,
    NotImplemented,
    Unprocessable,
    InternalServerError,
    NotFound,
    Conflict,
    BadRequest,
    Unauthorized,
    UserError,
    Forbidden
}