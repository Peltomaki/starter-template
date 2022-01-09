const jwt = require('jsonwebtoken');

exports.verifyRoles = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(res.status(403).send({ errro: 'Ei oikeuksia' }));
    }
    next();
  };
};

//verifyRoles is a function which can take parameters and inside it is middleware function and it can access to req object
