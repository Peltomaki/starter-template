const bcrypt = require('bcryptjs/dist/bcrypt');
const db = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('./../utils/email');

const { User } = db;
const signToken = ({ user }) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, status, res, message) => {
  const token = signToken({ user });
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions).status(status).send({
    message,
    user,
  });
};

(exports.signup = async (req, res) => {
  try {
    console.log(req.body);
    const checkIfUserExist = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (checkIfUserExist) {
      return res.status(400).send({ error: 'Käyttäjä löytyy rekisteristä' });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send({ error: 'Salasanat eivat täsmänneet' });
    }
    const user = await User.create({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
      phone: req.body.phone,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: req.body.role,
    });

    if (user) {
      const userJson = user.toJSON();
      delete userJson.password;

      //create and send token
      createAndSendToken(userJson, 201, res, 'Käyttäjä luotu');
      //res.status(201).send({message: 'user created'})
    }
  } catch (error) {
    res.status(400).send({ error: 'jokin meni pieleen' });
  }
}),
  (exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      //check that email and password are given
      if (!email || !password) {
        return next(
          res.status(401).send({ error: 'Tunnus ja salasana pakollisia' })
        );
      }
      // Find user with email
      const user = await User.findOne({
        where: {
          [Op.and]: [
            {
              email: email,
            },
            {
              state: 'active',
            },
          ],
        },
      });
      //Compare password and user passsword from database
      // let isPasswordValid = await bcrypt.compare(password, user.password);
      //check that password is correct
      if (!(await user.correctPassword(password, user.password)) || !user) {
        //if (!(await bcrypt.compare(password, user.password)) || !user) {
        return next(
          res.status(401).send({ error: 'Tunnus tai salasana virheellinen 1' })
        );
      }
      const userJson = user.toJSON();
      delete userJson.password;
      console.log(userJson);
      createAndSendToken(userJson, 200, res, 'Kirjautuminen onnistui');
    } catch (error) {
      res.status(401).send({ error: 'Tunnus tai salasana virheellinen 2' });
    }
  });
(exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    return next(
      res.status(404).send({
        error: 'Sähköpostia ei löydy',
      })
    );
  }
  //Generate random reset token
  const resetToken = user.createPassswordResetToken();
  await user.save({ validateBeforeSave: false });
  // Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Unohdetun salasanan palautus to:${resetURL}\n Jos et ole unohtanut salasaa unoda tämä viesti`;
  try {
    console.log(resetToken);
    await sendEmail({
      email: user.email,
      subject: 'Salasanan reset token. Voimassa 10 min',
      message,
    });
    res
      .status(200)
      .send({ message: 'Salasana vaito token lähetetty sähköpostiin' });
  } catch (error) {
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();

    return next(
      res.status(500).send({
        error: 'Sähköpostin lähetys ei onnistunut. Yritä myöhemmin uudelleen.',
      })
    );
  }
}),
  (exports.resetPassword = async (req, res, next) => {
    // 1) Get user based on the token
    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
      const user = await User.findOne({
        where: {
          passwordResetToken: hashedToken,
          passwordResetTokenExpires: {
            [Op.gt]: Date.now(),
          },
        },
      });
      if (!user) {
        return next(
          res.status(400).send({ error: 'Token on viallinen tai vanhentunut' })
        );
      }
      user.password = bcrypt.hashSync(req.body.password);
      user.passwordResetToken = null;
      user.passwordResetTokenExpires = null;
      user.passwordChangedAt = Date.now();
      await user.save();
      const userJson = user.toJSON();
      delete userJson.password;
      createAndSendToken(user, 201, res, 'Salasana vaihdettu');
    } catch (error) {
      res.status(400).send({ error });
    }
  });

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return next(res.status(401).send({ error: 'Ei käyttäjää' }));
    }
    if (!(await user.correctPassword(req.body.oldPassword, user.password))) {
      return next(res.status(401).send({ error: 'Salasana virheellinen' }));
    }
    if (req.body.newPassword !== req.body.newPasswordConfirm) {
      return next(res.status(401).send({ error: 'Salasanat eivät täsmännet' }));
    }
    user.password = bcrypt.hashSync(req.body.newPassword);
    user.passwordChangedAt = Date.now();
    await user.save();
    const userJson = user.toJSON();
    delete userJson.password;
    createAndSendToken(userJson, 201, res, 'Salasana vaihdettu');
  } catch (error) {
    res.status(401).send({ error: 'Jokin meni pieleen' });
  }
};
