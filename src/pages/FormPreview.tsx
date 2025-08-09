import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { useAppSelector } from '../hooks/useAppSelector';
import FieldRenderer from '../components/FieldRenderer';
import { validateField, computeDerivedFieldValue } from '../utils/validation';
import { FormData, FormValidationError } from '../types/form';

const FormPreview: React.FC = () => {
  const { fields, derivedFields, currentFormName } = useAppSelector(state => state.formBuilder);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormValidationError[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Initialize form data with default values
  useEffect(() => {
    const initialData: FormData = {};
    
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialData[field.id] = field.defaultValue;
      }
    });

    setFormData(initialData);
  }, [fields]);

  // Compute derived field values when form data changes
  useEffect(() => {
    const updatedFormData = { ...formData };
    let hasChanges = false;

    derivedFields.forEach(derivedField => {
      const computedValue = computeDerivedFieldValue(derivedField, formData, [...fields, ...derivedFields]);
      if (updatedFormData[derivedField.id] !== computedValue) {
        updatedFormData[derivedField.id] = computedValue;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setFormData(updatedFormData);
    }
  }, [formData, fields, derivedFields]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear errors for this field
    setErrors(prev => prev.filter(error => error.fieldId !== fieldId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: FormValidationError[] = [];

    // Validate regular fields
    fields.forEach(field => {
      const fieldErrors = validateField(field, formData[field.id], formData);
      fieldErrors.forEach(errorMessage => {
        newErrors.push({ fieldId: field.id, message: errorMessage });
      });
    });

    // Validate derived fields
    derivedFields.forEach(field => {
      const fieldErrors = validateField(field, formData[field.id], formData);
      fieldErrors.forEach(errorMessage => {
        newErrors.push({ fieldId: field.id, message: errorMessage });
      });
    });

    setErrors(newErrors);

    if (newErrors.length === 0) {
      setSnackbar({ open: true, message: 'Form submitted successfully!', severity: 'success' });
      console.log('Form Data:', formData);
    } else {
      setSnackbar({ open: true, message: 'Please fix the form errors', severity: 'error' });
    }
  };

  const getFieldError = (fieldId: string) => {
    const error = errors.find(err => err.fieldId === fieldId);
    return error?.message;
  };

  if (fields.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <Typography variant="h5" gutterBottom color="text.secondary">
          No form to preview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create a form in the Form Builder first
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Form Preview
      </Typography>
      
      {currentFormName && (
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {currentFormName}
        </Typography>
      )}

      <Paper sx={{ p: 4, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          {fields.map(field => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={formData[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
              error={getFieldError(field.id)}
            />
          ))}

          {derivedFields.length > 0 && (
            <>
              <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="h6" color="secondary">
                  Computed Fields
                </Typography>
              </Box>
              
              {derivedFields.map(derivedField => (
                <FieldRenderer
                  key={derivedField.id}
                  field={derivedField}
                  value={formData[derivedField.id]}
                  onChange={(value) => handleFieldChange(derivedField.id, value)}
                  error={getFieldError(derivedField.id)}
                  disabled={true}
                />
              ))}
            </>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button type="submit" variant="contained" size="large">
              Submit Form
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormPreview;