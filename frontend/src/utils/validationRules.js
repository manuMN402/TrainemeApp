/**
 * Comprehensive validation rules and functions for trainer registration and profile forms
 * Provides reusable, testable validation logic separate from UI components
 */

// ============================================
// REGEX PATTERNS
// ============================================

const REGEX_PATTERNS = {
  // Letters and spaces only
  LETTERS_ONLY: /^[a-zA-Z\s]*$/,

  // Valid email format
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Digits only (0-9)
  DIGITS_ONLY: /^\d*$/,

  // Phone number (10 digits)
  PHONE_10_DIGITS: /^[0-9]{10}$/,

  // Strong password: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  // At least one uppercase letter
  HAS_UPPERCASE: /[A-Z]/,

  // At least one lowercase letter
  HAS_LOWERCASE: /[a-z]/,

  // At least one number
  HAS_NUMBER: /\d/,

  // At least one special character
  HAS_SPECIAL_CHAR: /[@$!%*?&]/,

  // Numeric only (including decimals)
  NUMERIC: /^\d+(\.\d{1,2})?$/,

  // URL validation
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,

  // City/Location (letters, spaces, hyphens, apostrophes)
  LOCATION: /^[a-zA-Z\s\-']*$/,
};

// ============================================
// VALIDATION RULES CONFIGURATION
// ============================================

const VALIDATION_RULES = {
  // Registration Fields
  firstName: {
    label: "First Name",
    rules: [
      { type: "required", message: "First name is required" },
      { type: "minLength", value: 2, message: "First name must be at least 2 characters" },
      { type: "maxLength", value: 50, message: "First name cannot exceed 50 characters" },
      { type: "pattern", pattern: REGEX_PATTERNS.LETTERS_ONLY, message: "First name can only contain letters and spaces" },
    ],
  },

  lastName: {
    label: "Last Name",
    rules: [
      { type: "required", message: "Last name is required" },
      { type: "minLength", value: 1, message: "Last name is required" },
      { type: "maxLength", value: 50, message: "Last name cannot exceed 50 characters" },
      { type: "pattern", pattern: REGEX_PATTERNS.LETTERS_ONLY, message: "Last name can only contain letters and spaces" },
    ],
  },

  email: {
    label: "Email",
    rules: [
      { type: "required", message: "Email is required" },
      { type: "pattern", pattern: REGEX_PATTERNS.EMAIL, message: "Please enter a valid email (e.g., trainer@gmail.com)" },
      { type: "maxLength", value: 100, message: "Email cannot exceed 100 characters" },
    ],
  },

  phone: {
    label: "Phone Number",
    rules: [
      { type: "required", message: "Phone number is required" },
      { type: "pattern", pattern: REGEX_PATTERNS.DIGITS_ONLY, message: "Phone can only contain digits (0-9)" },
      { type: "exactLength", value: 10, message: "Phone must be exactly 10 digits" },
    ],
  },

  password: {
    label: "Password",
    rules: [
      { type: "required", message: "Password is required" },
      { type: "minLength", value: 8, message: "Password must be at least 8 characters" },
      { type: "maxLength", value: 50, message: "Password cannot exceed 50 characters" },
      { type: "pattern", pattern: REGEX_PATTERNS.HAS_UPPERCASE, message: "Password must contain at least one uppercase letter (A-Z)" },
      { type: "pattern", pattern: REGEX_PATTERNS.HAS_LOWERCASE, message: "Password must contain at least one lowercase letter (a-z)" },
      { type: "pattern", pattern: REGEX_PATTERNS.HAS_NUMBER, message: "Password must contain at least one number (0-9)" },
      { type: "pattern", pattern: REGEX_PATTERNS.HAS_SPECIAL_CHAR, message: "Password must contain a special character (@$!%*?&)" },
    ],
  },

  confirmPassword: {
    label: "Confirm Password",
    rules: [
      { type: "required", message: "Please confirm your password" },
      { type: "minLength", value: 8, message: "Confirm password must be at least 8 characters" },
    ],
  },

  // Profile Fields
  fullName: {
    label: "Full Name",
    rules: [
      { type: "required", message: "Full name is required" },
      { type: "minLength", value: 3, message: "Full name must be at least 3 characters" },
      { type: "maxLength", value: 100, message: "Full name cannot exceed 100 characters" },
    ],
  },

  bio: {
    label: "Bio / About Me",
    rules: [
      { type: "required", message: "Bio/About is required" },
      { type: "minLength", value: 10, message: "Bio must be at least 10 characters" },
      { type: "maxLength", value: 500, message: "Bio cannot exceed 500 characters" },
    ],
  },

  location: {
    label: "Location (City)",
    rules: [
      { type: "required", message: "Location is required" },
      { type: "minLength", value: 2, message: "Location must be at least 2 characters" },
      { type: "maxLength", value: 100, message: "Location cannot exceed 100 characters" },
      { type: "pattern", pattern: REGEX_PATTERNS.LOCATION, message: "Location can only contain letters, spaces, hyphens, and apostrophes" },
    ],
  },

  yearsExperience: {
    label: "Years of Experience",
    rules: [
      { type: "required", message: "Years of experience is required" },
      { type: "pattern", pattern: REGEX_PATTERNS.DIGITS_ONLY, message: "Years of experience must be a number" },
      { type: "minValue", value: 0, message: "Years of experience cannot be negative" },
      { type: "maxValue", value: 70, message: "Years of experience seems unrealistic" },
    ],
  },

  pricePerSession: {
    label: "Price Per Session",
    rules: [
      { type: "required", message: "Price per session is required" },
      { type: "pattern", pattern: REGEX_PATTERNS.NUMERIC, message: "Price must be a valid number (e.g., 50 or 50.99)" },
      { type: "minValue", value: 5, message: "Price must be at least $5" },
      { type: "maxValue", value: 10000, message: "Price seems unusually high" },
    ],
  },

  monthlyPlan: {
    label: "Monthly Plan",
    rules: [
      { type: "pattern", pattern: REGEX_PATTERNS.NUMERIC, message: "Monthly plan must be a valid number" },
      { type: "minValue", value: 10, message: "Monthly plan must be at least $10" },
    ],
  },
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validates a single field and returns error message if invalid, empty string if valid
 * @param {string} fieldName - The name of the field to validate
 * @param {string} value - The value to validate
 * @param {object} additionalContext - Optional context for cross-field validation (e.g., for confirmPassword)
 * @returns {string} - Error message or empty string
 */
export const validateField = (fieldName, value, additionalContext = {}) => {
  const rules = VALIDATION_RULES[fieldName];

  if (!rules) {
    console.warn(`No validation rules found for field: ${fieldName}`);
    return "";
  }

  // Run through each rule and return the first error found
  for (const rule of rules.rules) {
    const error = validateRule(rule, value, fieldName, additionalContext);
    if (error) {
      return error;
    }
  }

  return ""; // Valid
};

/**
 * Validates a single rule against a value
 * @private
 */
const validateRule = (rule, value, fieldName, context = {}) => {
  switch (rule.type) {
    case "required":
      if (!value || value.trim().length === 0) {
        return rule.message;
      }
      return "";

    case "minLength":
      if (value.trim().length < rule.value) {
        return rule.message;
      }
      return "";

    case "maxLength":
      if (value.trim().length > rule.value) {
        return rule.message;
      }
      return "";

    case "exactLength":
      if (value.length !== rule.value) {
        return rule.message;
      }
      return "";

    case "pattern":
      if (value && !rule.pattern.test(value)) {
        return rule.message;
      }
      return "";

    case "minValue":
      const numMin = parseFloat(value);
      if (!isNaN(numMin) && numMin < rule.value) {
        return rule.message;
      }
      return "";

    case "maxValue":
      const numMax = parseFloat(value);
      if (!isNaN(numMax) && numMax > rule.value) {
        return rule.message;
      }
      return "";

    case "match":
      if (value !== context[rule.field]) {
        return rule.message;
      }
      return "";

    default:
      return "";
  }
};

/**
 * Validates entire form and returns object with field errors
 * @param {object} formData - Object with field names as keys and values
 * @returns {object} - Object with field names as keys and error messages as values (empty string if valid)
 */
export const validateForm = (formData) => {
  const errors = {};

  for (const [fieldName, value] of Object.entries(formData)) {
    errors[fieldName] = validateField(fieldName, value, formData);
  }

  return errors;
};

/**
 * Checks if form is completely valid (no errors)
 * @param {object} errors - Errors object from validateForm
 * @returns {boolean}
 */
export const isFormValid = (errors) => {
  return Object.values(errors).every((error) => error === "");
};

/**
 * Validates password match between password and confirm password
 * @param {string} password - The password value
 * @param {string} confirmPassword - The confirm password value
 * @returns {string} - Error message or empty string
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return "";
};

/**
 * Validates expertise selection (multi-select)
 * @param {array} selectedExpertise - Array of selected expertise strings
 * @param {number} minRequired - Minimum number of selections required (default: 1)
 * @returns {string} - Error message or empty string
 */
export const validateExpertiseSelection = (selectedExpertise, minRequired = 1) => {
  if (!selectedExpertise || selectedExpertise.length === 0) {
    return "Select at least one expertise area";
  }
  if (selectedExpertise.length < minRequired) {
    return `Select at least ${minRequired} expertise area${minRequired > 1 ? "s" : ""}`;
  }
  return "";
};

/**
 * Validates availability days selection
 * @param {array} selectedDays - Array of selected days
 * @returns {string} - Error message or empty string
 */
export const validateAvailabilityDays = (selectedDays) => {
  if (!selectedDays || selectedDays.length === 0) {
    return "Select at least one available day";
  }
  return "";
};

/**
 * Validates time slots selection
 * @param {array} selectedTimeSlots - Array of selected time slots
 * @returns {string} - Error message or empty string
 */
export const validateTimeSlots = (selectedTimeSlots) => {
  if (!selectedTimeSlots || selectedTimeSlots.length === 0) {
    return "Select at least one time slot";
  }
  return "";
};

/**
 * Gets human-readable field label
 * @param {string} fieldName - The field name
 * @returns {string} - The human-readable label
 */
export const getFieldLabel = (fieldName) => {
  return VALIDATION_RULES[fieldName]?.label || fieldName;
};

/**
 * Gets all validation rules for a field (for documentation/help text)
 * @param {string} fieldName - The field name
 * @returns {array} - Array of rule objects with type and message
 */
export const getFieldRules = (fieldName) => {
  return VALIDATION_RULES[fieldName]?.rules || [];
};

/**
 * Formats error message for UI display
 * Adds icon hint and proper casing
 * @param {string} errorMessage - The error message
 * @returns {string} - Formatted error message
 */
export const formatErrorMessage = (errorMessage) => {
  if (!errorMessage) return "";

  // Capitalize first letter if not already
  const formatted = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
  return formatted;
};

/**
 * Gets password strength indicator
 * @param {string} password - The password value
 * @returns {object} - { strength: 'weak' | 'medium' | 'strong', percentage: number }
 */
export const getPasswordStrength = (password) => {
  if (!password) {
    return { strength: "weak", percentage: 0 };
  }

  let strength = 0;
  const maxStrength = 5;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (REGEX_PATTERNS.HAS_UPPERCASE.test(password)) strength++;
  if (REGEX_PATTERNS.HAS_NUMBER.test(password)) strength++;
  if (REGEX_PATTERNS.HAS_SPECIAL_CHAR.test(password)) strength++;

  let strengthLevel = "weak";
  if (strength >= 4) strengthLevel = "strong";
  else if (strength >= 2) strengthLevel = "medium";

  return {
    strength: strengthLevel,
    percentage: (strength / maxStrength) * 100,
    score: strength,
  };
};

/**
 * Batch validates registration form fields
 * @param {object} formData - { firstName, lastName, email, phone, password, confirmPassword }
 * @returns {object} - { errors, isValid }
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};

  errors.firstName = validateField("firstName", formData.firstName);
  errors.lastName = validateField("lastName", formData.lastName);
  errors.email = validateField("email", formData.email);
  errors.phone = validateField("phone", formData.phone);
  errors.password = validateField("password", formData.password);
  errors.confirmPassword = validatePasswordMatch(formData.password, formData.confirmPassword);

  return {
    errors,
    isValid: isFormValid(errors),
  };
};

/**
 * Batch validates trainer profile form
 * @param {object} profileData - Profile form data
 * @returns {object} - { errors, isValid }
 */
export const validateTrainerProfileForm = (profileData) => {
  const errors = {};

  errors.fullName = validateField("fullName", profileData.fullName);
  errors.bio = validateField("bio", profileData.bio);
  errors.location = validateField("location", profileData.location);
  errors.expertise = validateExpertiseSelection(profileData.selectedExpertise);
  errors.yearsExperience = validateField("yearsExperience", profileData.yearsExperience);
  errors.availability = validateAvailabilityDays(profileData.selectedDays);
  errors.timeSlots = validateTimeSlots(profileData.selectedTimeSlots);
  errors.pricing = validateField("pricePerSession", profileData.pricePerSession);

  return {
    errors,
    isValid: isFormValid(errors),
  };
};

/**
 * Creates password strength hint text
 * @param {string} password - The password
 * @returns {string} - Hint text
 */
export const getPasswordHint = (password) => {
  const hints = [];

  if (!password) {
    return "Enter a strong password";
  }

  if (password.length < 8) {
    hints.push(`${8 - password.length} more character${8 - password.length > 1 ? "s" : ""}`);
  }
  if (!REGEX_PATTERNS.HAS_UPPERCASE.test(password)) {
    hints.push("1 uppercase letter");
  }
  if (!REGEX_PATTERNS.HAS_LOWERCASE.test(password)) {
    hints.push("1 lowercase letter");
  }
  if (!REGEX_PATTERNS.HAS_NUMBER.test(password)) {
    hints.push("1 number");
  }
  if (!REGEX_PATTERNS.HAS_SPECIAL_CHAR.test(password)) {
    hints.push("1 special character");
  }

  return hints.length > 0 ? `Missing: ${hints.join(", ")}` : "Strong password ✓";
};

export default {
  REGEX_PATTERNS,
  VALIDATION_RULES,
  validateField,
  validateForm,
  isFormValid,
  validatePasswordMatch,
  validateExpertiseSelection,
  validateAvailabilityDays,
  validateTimeSlots,
  getFieldLabel,
  getFieldRules,
  formatErrorMessage,
  getPasswordStrength,
  validateRegistrationForm,
  validateTrainerProfileForm,
  getPasswordHint,
};
