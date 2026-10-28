const { validationResult } = require('express-validator');
const { PatientDoctorMapping, Patient, Doctor } = require('../models');

/**
 * POST /api/mappings/
 * Assign a doctor to a patient. Both must exist and belong to the authenticated user's context.
 */
const createMapping = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { patient_id, doctor_id } = req.body;

    // Verify patient exists and belongs to this user
    const patient = await Patient.findOne({ where: { id: patient_id, created_by: req.user.id } });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found or access denied.' });
    }

    // Verify doctor exists
    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    // Check for duplicate mapping
    const existingMapping = await PatientDoctorMapping.findOne({ where: { patient_id, doctor_id } });
    if (existingMapping) {
      return res.status(409).json({ success: false, message: 'This doctor is already assigned to the patient.' });
    }

    const mapping = await PatientDoctorMapping.create({ patient_id, doctor_id });

    res.status(201).json({ success: true, message: 'Doctor assigned to patient successfully.', data: mapping });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mappings/
 * Retrieve all patient-doctor mappings.
 */
const getAllMappings = async (req, res, next) => {
  try {
    const mappings = await PatientDoctorMapping.findAll({
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'name', 'age', 'gender'] },
        { model: Doctor, as: 'doctor', attributes: ['id', 'name', 'specialization'] },
      ],
    });
    res.status(200).json({ success: true, count: mappings.length, data: mappings });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/mappings/:patient_id
 * Get all doctors assigned to a specific patient.
 */
const getMappingsByPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.params.patient_id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const mappings = await PatientDoctorMapping.findAll({
      where: { patient_id: req.params.patient_id },
      include: [{ model: Doctor, as: 'doctor' }],
    });

    res.status(200).json({ success: true, count: mappings.length, data: mappings });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/mappings/:id
 * Remove a doctor-patient assignment by mapping ID.
 */
const deleteMapping = async (req, res, next) => {
  try {
    const mapping = await PatientDoctorMapping.findByPk(req.params.id);
    if (!mapping) {
      return res.status(404).json({ success: false, message: 'Mapping not found.' });
    }

    await mapping.destroy();
    res.status(200).json({ success: true, message: 'Mapping removed successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createMapping, getAllMappings, getMappingsByPatient, deleteMapping };
