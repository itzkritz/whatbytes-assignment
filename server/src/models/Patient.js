const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Patient = sequelize.define(
  'Patient',
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
        notEmpty: { msg: 'Patient name cannot be empty' },
        len: { args: [2, 100], msg: 'Name must be between 2 and 100 characters' },
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Age must be a positive number' },
        max: { args: [150], msg: 'Age must be a realistic value' },
        isInt: { msg: 'Age must be an integer' },
      },
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false,
      validate: {
        isIn: { args: [['male', 'female', 'other']], msg: 'Gender must be male, female, or other' },
      },
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Contact cannot be empty' },
      },
    },
    medical_history: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    tableName: 'patients',
    timestamps: true,
  }
);

// A patient is created by a User
Patient.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(Patient, { foreignKey: 'created_by', as: 'patients' });

module.exports = Patient;
