const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

const PatientDoctorMapping = sequelize.define(
  'PatientDoctorMapping',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id',
      },
    },
    doctor_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'doctors',
        key: 'id',
      },
    },
  },
  {
    tableName: 'patient_doctor_mappings',
    timestamps: true,
    indexes: [
      {
        // Prevent duplicate assignments
        unique: true,
        fields: ['patient_id', 'doctor_id'],
      },
    ],
  }
);

// Associations
PatientDoctorMapping.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
PatientDoctorMapping.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });

Patient.belongsToMany(Doctor, {
  through: PatientDoctorMapping,
  foreignKey: 'patient_id',
  as: 'doctors',
});
Doctor.belongsToMany(Patient, {
  through: PatientDoctorMapping,
  foreignKey: 'doctor_id',
  as: 'patients',
});

module.exports = PatientDoctorMapping;
