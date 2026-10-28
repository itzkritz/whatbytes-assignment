const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');

const router = express.Router();

// All patient routes require authentication
router.use(protect);

const patientValidation = [
  body('name').trim().notEmpty().withMessage('Patient name is required'),
  body('age').isInt({ min: 0 }).withMessage('Age must be a non-negative integer'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('contact').trim().notEmpty().withMessage('Contact is required'),
];

router.post('/', patientValidation, createPatient);
router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.put('/:id', patientValidation, updatePatient);
router.delete('/:id', deletePatient);

module.exports = router;
