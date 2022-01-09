const jwt = require('jsonwebtoken');
const db = require('../models');
const { promisify } = require('util');
const { User } = db;
exports.verifyJwt = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      res
        .status(401)
        .send({ error: 'Et ole kirjautunut sisään. Ole hyvä ja kirjaudu.' })
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findOne({
    where: {
      id: decoded.id,
    },
    raw: true,
  });
  if (!currentUser) {
    return next(
      res.status(401).send({
        error: 'Käyttäjää kyseiselle tokenille ei löytynyt',
        token: null,
      })
    );
  }
  if (currentUser.passwordChangedAt) {
    const changedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (decoded.iat < changedTimestamp) {
      return next(
        res.status(401).send({
          error: 'Käyttäjän salasana vaihtunut. Kirjaudu uudelllen sisään',
          token: null,
        })
      );
    }
  }

  delete currentUser.password;
  req.user = currentUser;
  next();
};
