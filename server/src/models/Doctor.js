const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define(
  'Doctor',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Doctor name cannot be empty' },
        len: { args: [2, 100], msg: 'Name must be between 2 and 100 characters' },
      },
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Specialization cannot be empty' },
      },
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Contact cannot be empty' },
      },
    },
    experience_years: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Experience years must be a positive number' },
        isInt: { msg: 'Experience years must be an integer' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Doctor email already exists' },
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
        notEmpty: { msg: 'Email cannot be empty' },
      },
    },
  },
  {
    tableName: 'doctors',
    timestamps: true,
  }
);

module.exports = Doctor;
