# Validation Rules & Functions Guide

## Overview
This document explains the centralized validation system for trainer registration and profile forms. All validation logic is contained in `validationRules.js`, providing reusable, testable validation functions separate from UI components.

## File Location
```
frontend/src/utils/validationRules.js
```

## Key Features

### 1. **Centralized Regex Patterns**
All regular expressions are defined in one place for consistency and maintainability:

```javascript
REGEX_PATTERNS = {
  LETTERS_ONLY,        // Letters and spaces
  EMAIL,              // Valid email format
  DIGITS_ONLY,        // Digits 0-9 only
  PHONE_10_DIGITS,    // 10-digit phone numbers
  STRONG_PASSWORD,    // Min 8 chars, upper, lower, number, special
  HAS_UPPERCASE,      // At least one uppercase letter
  HAS_LOWERCASE,      // At least one lowercase letter
  HAS_NUMBER,         // At least one digit
  HAS_SPECIAL_CHAR,   // At least one special char (@$!%*?&)
  NUMERIC,            // Numbers with optional decimals
  URL,                // Valid URL format
  LOCATION,           // City names (letters, spaces, hyphens, apostrophes)
}
```

### 2. **Validation Rules Configuration**
Each field has predefined rules with clear error messages:

```javascript
VALIDATION_RULES = {
  firstName: {
    label: "First Name",
    rules: [
      { type: "required", message: "First name is required" },
      { type: "minLength", value: 2, message: "First name must be at least 2 characters" },
      { type: "maxLength", value: 50, message: "First name cannot exceed 50 characters" },
      { type: "pattern", pattern: REGEX_PATTERNS.LETTERS_ONLY, message: "..." },
    ]
  },
  // ... more fields
}
```

### 3. **Real-Time Validation**
Fields validate as users type, providing immediate feedback:

```javascript
// In component state updates
const handleFieldChange = (fieldName, value, stateSetter) => {
  stateSetter(value);
  const fieldError = validateField(fieldName, value, additionalContext);
  setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
};

// Usage in TextInput
<TextInput
  value={firstName}
  onChangeText={(v) => handleFieldChange("firstName", v, setFirstName)}
/>
```

## Core Functions

### `validateField(fieldName, value, additionalContext?)`
Validates a single field against its rules and returns error message.

**Parameters:**
- `fieldName` (string) - Field identifier (e.g., "firstName", "email")
- `value` (string) - The value to validate
- `additionalContext` (object) - Optional context for cross-field validation (e.g., password match)

**Returns:** 
- Empty string if valid
- Error message if invalid

**Example:**
```javascript
const error = validateField("email", "user@example.com");
// Returns "" (valid)

const error = validateField("email", "invalid.email");
// Returns "Please enter a valid email (e.g., trainer@gmail.com)"
```

### `validateForm(formData)`
Validates entire form and returns error object.

**Parameters:**
- `formData` (object) - { firstName, lastName, email, phone, ... }

**Returns:** 
```javascript
{
  firstName: "",      // Empty = valid
  lastName: "Last name is required",
  email: "",
  // ...
}
```

**Example:**
```javascript
const errors = validateForm({
  firstName: "John",
  lastName: "",
  email: "john@example.com"
});
```

### `isFormValid(errors)`
Checks if entire form is valid (no errors).

**Parameters:**
- `errors` (object) - Error object from validateForm

**Returns:** Boolean

**Example:**
```javascript
const valid = isFormValid(errors);
if (valid) {
  // Submit form
}
```

### `validatePasswordMatch(password, confirmPassword)`
Validates password confirmation.

**Example:**
```javascript
const error = validatePasswordMatch("MyPass123!", "MyPass123!");
// Returns "" (passwords match)
```

### `validateExpertiseSelection(selectedExpertise, minRequired?)`
Validates multi-select expertise.

**Parameters:**
- `selectedExpertise` (array) - Array of selected skills
- `minRequired` (number) - Minimum selections (default: 1)

**Example:**
```javascript
const error = validateExpertiseSelection(["Fitness", "Yoga"]);
// Returns "" (valid)

const error = validateExpertiseSelection([]);
// Returns "Select at least one expertise area"
```

### `validateRegistrationForm(formData)`
Batch validation for registration form.

**Returns:**
```javascript
{
  errors: { firstName: "", lastName: "", email: "", ... },
  isValid: true/false
}
```

**Example:**
```javascript
const { errors, isValid } = validateRegistrationForm({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "5551234567",
  password: "MyPassword123!",
  confirmPassword: "MyPassword123!"
});

if (!isValid) {
  // Show errors
}
```

### `validateTrainerProfileForm(profileData)`
Batch validation for trainer profile form.

**Example:**
```javascript
const { errors, isValid } = validateTrainerProfileForm({
  fullName: "John Doe",
  bio: "Professional trainer with 5 years experience",
  location: "New York",
  selectedExpertise: ["Fitness", "Weight Loss"],
  yearsExperience: "5",
  selectedDays: ["Mon", "Wed", "Fri"],
  selectedTimeSlots: ["6:00 AM - 9:00 AM"],
  pricePerSession: "50"
});
```

### `getPasswordStrength(password)`
Analyzes password strength.

**Returns:**
```javascript
{
  strength: "weak" | "medium" | "strong",
  percentage: 0-100,
  score: 0-5
}
```

**Example:**
```javascript
const strength = getPasswordStrength("MyPass123!");
// Returns { strength: "strong", percentage: 100, score: 5 }
```

### `getPasswordHint(password)`
Returns user-friendly hint about missing password requirements.

**Returns:** String hint

**Example:**
```javascript
getPasswordHint("password");
// Returns "Missing: uppercase letter, number, special character"

getPasswordHint("MyPass123!");
// Returns "Strong password ✓"
```

## Integration Examples

### Trainer Registration Screen

```javascript
import { validateField, validateRegistrationForm } from "../utils/validationRules";

export default function TrainerRegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  // Real-time validation while typing
  const handleFieldChange = (fieldName, value, stateSetter) => {
    stateSetter(value);
    const fieldError = validateField(fieldName, value, { password, confirmPassword });
    setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
  };

  // Validate before submission
  const validateBeforeSubmit = () => {
    const formData = { firstName, lastName, email, phone, password, confirmPassword };
    const { errors: validationErrors, isValid } = validateRegistrationForm(formData);
    setErrors(validationErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateBeforeSubmit()) {
      Alert.alert("Form Error", "Please fix all validation errors");
      return;
    }
    // Proceed with registration
  };

  return (
    <ScrollView>
      <Input
        label="First Name"
        value={firstName}
        onChange={(v) => handleFieldChange("firstName", v, setFirstName)}
        error={errors.firstName}
      />
      {/* More fields... */}
      <PasswordInput
        label="Confirm Password"
        value={confirmPassword}
        onChange={(v) => handleFieldChange("confirmPassword", v, setConfirmPassword)}
        error={errors.confirmPassword}
      />
    </ScrollView>
  );
}
```

### Trainer Profile Screen

```javascript
import {
  validateField,
  validateExpertiseSelection,
  validateTrainerProfileForm,
} from "../utils/validationRules";

export default function TrainerProfile({ route, navigation }) {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [yearsExperience, setYearsExperience] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [pricePerSession, setPricePerSession] = useState("");
  const [errors, setErrors] = useState({});

  // Real-time field validation
  const handleFieldChange = (fieldName, value, stateSetter) => {
    stateSetter(value);
    const error = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  // Validate before submission
  const validateBeforeSubmit = () => {
    const profileData = {
      fullName,
      bio,
      location,
      selectedExpertise,
      yearsExperience,
      selectedDays,
      selectedTimeSlots,
      pricePerSession,
    };
    const { errors: validationErrors, isValid } = validateTrainerProfileForm(profileData);
    setErrors(validationErrors);
    return isValid;
  };

  const handleSaveProfile = async () => {
    if (!validateBeforeSubmit()) {
      Alert.alert("Validation Error", "Please fill all required fields");
      return;
    }
    // Save profile
  };

  return (
    <ScrollView>
      <TextInput
        value={fullName}
        onChangeText={(v) => handleFieldChange("fullName", v, setFullName)}
        style={{ borderColor: errors.fullName ? "#ef4444" : "#ccc" }}
      />
      {errors.fullName && <Text style={{ color: "#ef4444" }}>{errors.fullName}</Text>}
      {/* More fields... */}
    </ScrollView>
  );
}
```

## Validation Rules Reference

### Registration Fields

| Field | Required | Min | Max | Pattern | Rules |
|-------|----------|-----|-----|---------|-------|
| firstName | ✓ | 2 | 50 | Letters only | No special chars, numbers |
| lastName | ✓ | 1 | 50 | Letters only | No special chars, numbers |
| email | ✓ | - | 100 | Valid email | Standard email format |
| phone | ✓ | - | - | 10 digits | Exactly 10 digits |
| password | ✓ | 8 | 50 | Strong | Upper, lower, number, special |
| confirmPassword | ✓ | 8 | - | Match | Must match password |

### Profile Fields

| Field | Required | Min | Max | Pattern | Rules |
|-------|----------|-----|-----|---------|-------|
| fullName | ✓ | 3 | 100 | Text | Any format |
| bio | ✓ | 10 | 500 | Text | Detailed description |
| location | ✓ | 2 | 100 | Location | Letters, spaces, hyphens, apostrophes |
| yearsExperience | ✓ | - | - | Number | 0-70 range |
| pricePerSession | ✓ | - | - | Number | $5-$10000 |
| monthlyPlan | ✗ | - | - | Number | Optional |
| expertise | ✓ | - | - | Array | Min 1 selection |
| days | ✓ | - | - | Array | Min 1 day |
| timeSlots | ✓ | - | - | Array | Min 1 slot |

## Error Message Examples

**Good Error Messages:**
```
❌ "Email is required"
❌ "Password must be at least 8 characters"
❌ "Phone must be exactly 10 digits"
❌ "Passwords do not match"
```

**Not Helpful:**
```
❌ "Invalid input"
❌ "Error"
❌ "Check field"
```

## Best Practices

### 1. **Separate Validation from UI**
✅ DO: Put validation logic in `validationRules.js`
❌ DON'T: Put validation directly in React components

### 2. **Provide Real-Time Feedback**
✅ DO: Validate as user types
❌ DON'T: Only validate on submit

### 3. **Use Clear Error Messages**
✅ DO: "Phone must be exactly 10 digits"
❌ DON'T: "Phone invalid"

### 4. **Show Actionable Hints**
✅ DO: "Password missing: uppercase letter, number"
❌ DON'T: Just show red border

### 5. **Cross-Field Validation**
✅ DO: Pass additionalContext for password matching
```javascript
validateField("confirmPassword", value, { password })
```

### 6. **Batch Validation on Submit**
✅ DO: Run full form validation before submission
```javascript
const { errors, isValid } = validateRegistrationForm(formData);
if (!isValid) return; // Show errors
```

## Testing Validation Functions

```javascript
import {
  validateField,
  validateRegistrationForm,
  getPasswordStrength,
} from "../utils/validationRules";

// Test single field
expect(validateField("firstName", "a")).toBe("First name must be at least 2 characters");
expect(validateField("firstName", "John")).toBe("");

// Test password strength
const strength = getPasswordStrength("weak");
expect(strength.strength).toBe("weak");

// Test form validation
const result = validateRegistrationForm({
  firstName: "",
  lastName: "Doe",
  email: "john@example.com",
  phone: "5551234567",
  password: "MyPass123!",
  confirmPassword: "MyPass123!"
});
expect(result.isValid).toBe(false);
expect(result.errors.firstName).toBe("First name is required");
```

## Future Enhancements

- [ ] Add custom validation rules per field
- [ ] Support for async validation (email availability check)
- [ ] Localization for error messages
- [ ] Custom error message formatting
- [ ] Validation performance optimization
- [ ] Unit test suite for all validators
