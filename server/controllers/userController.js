const db = require('../models');
const { Op } = require('sequelize');

const { User } = db;

exports.getAllUsers = async (req, res, next) => {
  const users = await User.findAll({
    attributes: {
      exclude: ['password'],
    },
  });
  console.log(req.user);
  if (users) {
    return res.status(200).send(users);
  }
  res.status(400).send({ message: 'Käyttäjiä ei löydy' });
};
exports.updateCurrentUser = async (req, res, next) => {
  if (req.body.password || req.body.role) {
    return next(
      res.status(400).send({
        error: 'Tämä route on väärä päivitettäessä salsanaa tai roolia',
      })
    );
  }

  const user = await User.findByPk(req.user.id);

  const checkEmail = await User.findOne({
    where: {
      [Op.and]: [
        {
          email: req.body.email,
        },
        {
          id: {
            [Op.ne]: req.user.id,
          },
        },
      ],
    },
  });

  if (checkEmail) {
    return next(res.status(400).send({ error: 'Sähköposti on jo käytössä' }));
  }
  //   user.firstName = req.body.firstName;
  //   user.lastName = req.body.lastName;
  //   user.email = req.body.email;

  //await user.save();
  const result = await user.update({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  });
  console.log(result);
  return res.status(200).send({ message: 'Tiedot päivitetty', user });
};
