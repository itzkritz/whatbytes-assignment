const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  createMapping,
  getAllMappings,
  getMappingsByPatient,
  deleteMapping,
} = require('../controllers/mappingController');

const router = express.Router();

// All mapping routes require authentication
router.use(protect);

const mappingValidation = [
  body('patient_id').notEmpty().isUUID().withMessage('A valid patient_id (UUID) is required'),
  body('doctor_id').notEmpty().isUUID().withMessage('A valid doctor_id (UUID) is required'),
];

router.post('/', mappingValidation, createMapping);
router.get('/', getAllMappings);
router.get('/:patient_id', getMappingsByPatient);
router.delete('/:id', deleteMapping);

module.exports = router;
