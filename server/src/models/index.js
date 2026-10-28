const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const PatientDoctorMapping = require('./PatientDoctorMapping');

// All associations are defined within each model file.
// This index file just re-exports all models for convenient importing.

module.exports = {
  User,
  Patient,
  Doctor,
  PatientDoctorMapping,
};
