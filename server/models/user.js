'use strict';
const { Model } = require('sequelize');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    createPassswordResetToken = () => {
      const passwordResetToken = crypto.randomBytes(32).toString('hex');
      this.passwordResetToken = crypto
        .createHash('sha256')
        .update(passwordResetToken)
        .digest('hex');

      this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

      return passwordResetToken;
    };

    correctPassword = async (givenPassword, userPassword) => {
      console.log(userPassword);
      return await bcrypt.compare(givenPassword, userPassword);
    };
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
      },

      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: {
            msg: 'Tarkasta sähköpostin muoto',
          },
        },
      },

      role: {
        type: DataTypes.ENUM,
        values: ['user', 'main-user', 'admin'],
        allowNull: false,
        defaultValue: 'user',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 8,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      address: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      postalDistrict: {
        type: DataTypes.STRING,
        defaultValue: null,
      },

      zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      state: {
        type: DataTypes.ENUM,
        values: ['active', 'passive'],
        defaultValue: 'passive',
      },
      passwordChangedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      passwordResetToken: {
        type: DataTypes.STRING,
      },
      passwordResetTokenExpires: {
        type: DataTypes.DATE,
      },
    },

    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
