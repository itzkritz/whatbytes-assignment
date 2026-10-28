const { validationResult } = require('express-validator');
const { Doctor } = require('../models');

/**
 * POST /api/doctors/
 * Create a new doctor (authenticated users only).
 */
const createDoctor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, specialization, contact, experience_years, email } = req.body;
    const doctor = await Doctor.create({ name, specialization, contact, experience_years, email });

    res.status(201).json({ success: true, message: 'Doctor created successfully.', data: doctor });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/doctors/
 * Retrieve all doctors.
 */
const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.findAll();
    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/doctors/:id
 * Get details of a specific doctor.
 */
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/doctors/:id
 * Update doctor details.
 */
const updateDoctor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const { name, specialization, contact, experience_years, email } = req.body;
    await doctor.update({ name, specialization, contact, experience_years, email });

    res.status(200).json({ success: true, message: 'Doctor updated successfully.', data: doctor });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/doctors/:id
 * Delete a doctor record.
 */
const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }
    await doctor.destroy();
    res.status(200).json({ success: true, message: 'Doctor deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor };
