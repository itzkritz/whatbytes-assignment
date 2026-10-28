const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');

const router = express.Router();

// All doctor routes require authentication
router.use(protect);

const doctorValidation = [
  body('name').trim().notEmpty().withMessage('Doctor name is required'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
  body('contact').trim().notEmpty().withMessage('Contact is required'),
  body('experience_years').isInt({ min: 0 }).withMessage('Experience years must be a non-negative integer'),
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
];

router.post('/', doctorValidation, createDoctor);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.put('/:id', doctorValidation, updateDoctor);
router.delete('/:id', deleteDoctor);

module.exports = router;
