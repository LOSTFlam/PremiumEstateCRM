const { body, param, query, validationResult } = require('express-validator');

// Middleware to validate request
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Property validation rules
const propertyValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Property name is required')
      .isLength({ max: 200 }).withMessage('Name must be less than 200 characters'),
    
    body('propertyAddress')
      .trim()
      .notEmpty().withMessage('Property address is required')
      .isLength({ max: 500 }).withMessage('Address must be less than 500 characters'),
    
    body('listingPrice')
      .optional()
      .isNumeric().withMessage('Price must be a number')
      .toFloat(),
    
    body('numberofBedrooms')
      .optional()
      .isInt({ min: 0, max: 50 }).withMessage('Bedrooms must be between 0 and 50'),
    
    body('numberofBathrooms')
      .optional()
      .isInt({ min: 0, max: 50 }).withMessage('Bathrooms must be between 0 and 50'),
    
    body('squareFootage')
      .optional()
      .isNumeric().withMessage('Area must be a number'),
    
    body('yearBuilt')
      .optional()
      .isInt({ min: 1800, max: new Date().getFullYear() + 1 })
      .withMessage(`Year must be between 1800 and ${new Date().getFullYear() + 1}`),
    
    body('propertyType')
      .optional()
      .isIn(['House', 'Apartment', 'Land', 'Commercial'])
      .withMessage('Invalid property type'),
    
    body('listingStatus')
      .optional()
      .isIn(['Available', 'Sold', 'Pending', 'Blocked'])
      .withMessage('Invalid status'),
    
    validate
  ],
  
  update: [
    param('id')
      .isMongoId().withMessage('Invalid property ID'),
    
    body('name')
      .optional()
      .trim()
      .isLength({ max: 200 }).withMessage('Name must be less than 200 characters'),
    
    body('propertyAddress')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Address must be less than 500 characters'),
    
    body('listingPrice')
      .optional()
      .isNumeric().withMessage('Price must be a number')
      .toFloat(),
    
    validate
  ],
  
  delete: [
    param('id')
      .isMongoId().withMessage('Invalid property ID'),
    validate
  ]
};

// User validation rules
const userValidation = {
  register: [
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    
    body('firstName')
      .trim()
      .notEmpty().withMessage('First name is required')
      .isLength({ max: 100 }).withMessage('First name must be less than 100 characters'),
    
    body('lastName')
      .trim()
      .notEmpty().withMessage('Last name is required')
      .isLength({ max: 100 }).withMessage('Last name must be less than 100 characters'),
    
    validate
  ],
  
  login: [
    body('username')
      .trim()
      .notEmpty().withMessage('Username or email is required'),
    
    body('password')
      .notEmpty().withMessage('Password is required'),
    
    validate
  ]
};

// Lead validation rules
const leadValidation = {
  create: [
    body('leadName')
      .trim()
      .notEmpty().withMessage('Lead name is required')
      .isLength({ max: 200 }).withMessage('Name must be less than 200 characters'),
    
    body('leadEmail')
      .optional()
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    
    body('leadMobile')
      .optional()
      .matches(/^[0-9+\-\s()]+$/).withMessage('Invalid phone number format'),
    
    validate
  ]
};

// Contact validation rules
const contactValidation = {
  create: [
    body('fullName')
      .trim()
      .notEmpty().withMessage('Contact name is required')
      .isLength({ max: 200 }).withMessage('Name must be less than 200 characters'),
    
    body('email')
      .optional()
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    
    body('phoneNumber')
      .optional()
      .matches(/^[0-9+\-\s()]+$/).withMessage('Invalid phone number format'),
    
    validate
  ]
};

module.exports = {
  validate,
  propertyValidation,
  userValidation,
  leadValidation,
  contactValidation
};
