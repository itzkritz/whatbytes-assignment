const { validationResult } = require('express-validator');
const { Patient } = require('../models');

/**
 * POST /api/patients/
 * Create a new patient. Patient is linked to the logged-in user.
 */
const createPatient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, age, gender, contact, medical_history } = req.body;
    const patient = await Patient.create({
      name,
      age,
      gender,
      contact,
      medical_history,
      created_by: req.user.id,
    });

    res.status(201).json({ success: true, message: 'Patient created successfully.', data: patient });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/patients/
 * Get all patients created by the authenticated user.
 */
const getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.findAll({ where: { created_by: req.user.id } });
    res.status(200).json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/patients/:id
 * Get a specific patient by ID. Only accessible by the user who created it.
 */
const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({
      where: { id: req.params.id, created_by: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/patients/:id
 * Update a patient's details. Only accessible by the user who created it.
 */
const updatePatient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const patient = await Patient.findOne({
      where: { id: req.params.id, created_by: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const { name, age, gender, contact, medical_history } = req.body;
    await patient.update({ name, age, gender, contact, medical_history });

    res.status(200).json({ success: true, message: 'Patient updated successfully.', data: patient });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/patients/:id
 * Delete a patient. Only accessible by the user who created it.
 */
const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({
      where: { id: req.params.id, created_by: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    await patient.destroy();
    res.status(200).json({ success: true, message: 'Patient deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPatient, getAllPatients, getPatientById, updatePatient, deletePatient };
