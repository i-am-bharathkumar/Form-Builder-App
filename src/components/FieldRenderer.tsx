import React from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FormField, DerivedField } from '../types/form';

interface FieldRendererProps {
  field: FormField | DerivedField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const isDerived = 'isDerived' in field;

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={disabled || isDerived}
            margin="normal"
            variant="outlined"
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={disabled || isDerived}
            margin="normal"
            variant="outlined"
          />
        );

      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={disabled || isDerived}
            margin="normal"
            variant="outlined"
          />
        );

      case 'select':
        const selectField = field as FormField & { options: string[] };
        return (
          <FormControl 
            fullWidth 
            margin="normal" 
            error={!!error}
            disabled={disabled || isDerived}
          >
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              label={field.label}
              onChange={(e) => onChange(e.target.value)}
            >
              {selectField.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'radio':
        const radioField = field as FormField & { options: string[] };
        return (
          <FormControl component="fieldset" margin="normal" error={!!error} disabled={disabled || isDerived}>
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            >
              {radioField.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'checkbox':
        return (
          <Box sx={{ mt: 2, mb: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={value || false}
                  onChange={(e) => onChange(e.target.checked)}
                  disabled={disabled || isDerived}
                />
              }
              label={field.label}
            />
            {error && (
              <Typography variant="caption" color="error" display="block" sx={{ ml: 4 }}>
                {error}
              </Typography>
            )}
          </Box>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={field.label}
              value={value ? dayjs(value) : null}
              onChange={(newValue) => onChange(newValue ? newValue.format('YYYY-MM-DD') : '')}
              disabled={disabled || isDerived}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                  error: !!error,
                  helperText: error,
                  variant: 'outlined',
                },
              }}
            />
          </LocalizationProvider>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {renderField()}
      {isDerived && (
        <Chip 
          label="Auto-calculated" 
          size="small" 
          color="secondary" 
          sx={{ position: 'absolute', top: 8, right: 8 }} 
        />
      )}
    </Box>
  );
};

export default FieldRenderer;