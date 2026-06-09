/**
 * Password Validation Middleware
 * Enforces password complexity rules per security requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * - Not in password history (last 5 passwords)
 */

const bcrypt = require('bcryptjs');

// Password complexity requirements
const PASSWORD_CONFIG = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  historyCount: 5,  // Number of previous passwords to check against (last 5 passwords)
  saltRounds: 10,   // bcrypt salt rounds (balanced for security and performance)
};

// Common passwords blacklist
const COMMON_PASSWORDS = [
  'password', 'password123', 'admin', 'admin123', '12345678',
  'qwerty', 'abc123', 'letmein', 'welcome', 'monkey',
  'master', 'dragon', 'login', '123456789', '111111',
  'premiumestate', 'premium123', 'estate123', 'realestate',
];

/**
 * Validate password complexity
 * @param {string} password - Password to validate
 * @returns {{ valid: boolean, errors: string[] }}
 */
const validatePasswordComplexity = (password) => {
  const errors = [];

  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['Password is required'] };
  }

  if (password.length < PASSWORD_CONFIG.minLength) {
    errors.push(`Password must be at least ${PASSWORD_CONFIG.minLength} characters long`);
  }

  if (password.length > PASSWORD_CONFIG.maxLength) {
    errors.push(`Password must not exceed ${PASSWORD_CONFIG.maxLength} characters`);
  }

  if (PASSWORD_CONFIG.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (PASSWORD_CONFIG.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (PASSWORD_CONFIG.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (PASSWORD_CONFIG.requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check against common passwords
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('Password is too common, please choose a more secure password');
  }

  // Check for sequential characters (e.g., abc, 123)
  const hasSequential = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password);
  if (hasSequential) {
    errors.push('Password must not contain sequential characters');
  }

  // Check for repeated characters (e.g., aaa, 111)
  const hasRepeated = /(.)\1{2,}/.test(password);
  if (hasRepeated) {
    errors.push('Password must not contain repeated characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Check if password matches any in history
 * @param {string} newPassword - New password to check
 * @param {Array} passwordHistory - Array of { password: string } objects
 * @returns {Promise<{ valid: boolean, error: string|null }>}
 */
const checkPasswordHistory = async (newPassword, passwordHistory = []) => {
  if (!passwordHistory || passwordHistory.length === 0) {
    return { valid: true, error: null };
  }

  // Check only the last N passwords
  const recentPasswords = passwordHistory.slice(-PASSWORD_CONFIG.historyCount);

  for (const entry of recentPasswords) {
    const matches = await bcrypt.compare(newPassword, entry.password);
    if (matches) {
      return {
        valid: false,
        error: `Password was used recently. Please choose a different password.`,
      };
    }
  }

  return { valid: true, error: null };
};

/**
 * Hash password with bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, PASSWORD_CONFIG.saltRounds);
};

/**
 * Middleware: Validate password in request body
 * Use as: validatePassword(req, res, next)
 */
const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required',
    });
  }

  const validation = validatePasswordComplexity(password);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: 'Password does not meet requirements',
      errors: validation.errors,
    });
  }

  next();
};

/**
 * Middleware: Validate password change with history check
 * Use as: validatePasswordChange(user, newPassword, res)
 * @returns {Promise<{ valid: boolean, hashedPassword: string|null, error: string|null }>}
 */
const validatePasswordChange = async (user, newPassword) => {
  // Validate complexity
  const complexityValidation = validatePasswordComplexity(newPassword);
  if (!complexityValidation.valid) {
    return {
      valid: false,
      hashedPassword: null,
      errors: complexityValidation.errors,
    };
  }

  // Check history
  const historyCheck = await checkPasswordHistory(newPassword, user.passwordHistory);
  if (!historyCheck.valid) {
    return {
      valid: false,
      hashedPassword: null,
      error: historyCheck.error,
    };
  }

  // Hash the new password
  const hashedPassword = await hashPassword(newPassword);

  return {
    valid: true,
    hashedPassword,
    error: null,
  };
};

module.exports = {
  PASSWORD_CONFIG,
  validatePasswordComplexity,
  validatePassword,
  validatePasswordChange,
  hashPassword,
  checkPasswordHistory,
};
