import { ValidationRule, FormField, DerivedField, FormData } from '../types/form';

export const validateField = (
  field: FormField | DerivedField,
  value: any,
  formData: FormData
): string[] => {
  const errors: string[] = [];

  // Check required validation
  if (field.required && (value === undefined || value === null || value === '')) {
    errors.push(`${field.label} is required`);
    return errors; // Return early if required field is empty
  }

  // Only validate other rules if field has a value
  if (value !== undefined && value !== null && value !== '') {
    for (const rule of field.validationRules) {
      const error = validateRule(rule, value, field.label);
      if (error) {
        errors.push(error);
      }
    }
  }

  return errors;
};

const validateRule = (rule: ValidationRule, value: any, fieldLabel: string): string | null => {
  switch (rule.type) {
    case 'minLength':
      if (typeof value === 'string' && rule.value && value.length < rule.value) {
        return rule.message || `${fieldLabel} must be at least ${rule.value} characters`;
      }
      break;
    
    case 'maxLength':
      if (typeof value === 'string' && rule.value && value.length > rule.value) {
        return rule.message || `${fieldLabel} must be no more than ${rule.value} characters`;
      }
      break;
    
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value === 'string' && !emailRegex.test(value)) {
        return rule.message || `${fieldLabel} must be a valid email address`;
      }
      break;
    
    case 'password':
      const passwordRegex = /^(?=.*\d).{8,}$/;
      if (typeof value === 'string' && !passwordRegex.test(value)) {
        return rule.message || `${fieldLabel} must be at least 8 characters and contain at least one number`;
      }
      break;
  }
  
  return null;
};

export const computeDerivedFieldValue = (
  derivedField: DerivedField,
  formData: FormData,
  allFields: (FormField | DerivedField)[]
): any => {
  try {
    // Simple formula evaluation for common cases
    const formula = derivedField.formula.toLowerCase().trim();
    
    if (formula.includes('age') && derivedField.parentFields.length === 1) {
      // Calculate age from date of birth
      const dobFieldId = derivedField.parentFields[0];
      const dobValue = formData[dobFieldId];
      
      if (dobValue) {
        const birthDate = new Date(dobValue);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        return age >= 0 ? age : 0;
      }
    }
    
    if (formula.includes('sum') || formula.includes('+')) {
      // Sum of parent fields
      let sum = 0;
      for (const parentId of derivedField.parentFields) {
        const value = formData[parentId];
        if (typeof value === 'number') {
          sum += value;
        }
      }
      return sum;
    }
    
    if (formula.includes('concat') || formula.includes('join')) {
      // Concatenate parent field values
      const values = derivedField.parentFields
        .map(parentId => formData[parentId])
        .filter(value => value !== undefined && value !== null && value !== '');
      return values.join(' ');
    }
    
    // Default: return first parent field value
    if (derivedField.parentFields.length > 0) {
      return formData[derivedField.parentFields[0]];
    }
    
    return '';
  } catch (error) {
    console.error('Error computing derived field value:', error);
    return '';
  }
};