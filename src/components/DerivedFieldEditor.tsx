import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { DerivedField, FormField } from '../types/form';

interface DerivedFieldEditorProps {
  derivedField: DerivedField;
  availableFields: FormField[];
  onUpdate: (field: DerivedField) => void;
  onDelete: (fieldId: string) => void;
}

const DerivedFieldEditor: React.FC<DerivedFieldEditorProps> = ({
  derivedField,
  availableFields,
  onUpdate,
  onDelete,
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleFieldUpdate = (updates: Partial<DerivedField>) => {
    onUpdate({ ...derivedField, ...updates });
  };

  const handleParentFieldsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    handleFieldUpdate({ parentFields: typeof value === 'string' ? value.split(',') : value });
  };

  return (
    <>
      <Card sx={{ mb: 2, border: '2px solid #9c27b0', backgroundColor: '#f8e7ff' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                {derivedField.label} (Derived)
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip label="derived" size="small" color="secondary" />
                {derivedField.required && (
                  <Chip label="Required" size="small" color="error" />
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Formula: {derivedField.formula}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Parent Fields: {derivedField.parentFields.map(fieldId => {
                  const field = availableFields.find(f => f.id === fieldId);
                  return field?.label || fieldId;
                }).join(', ')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => setEditDialogOpen(true)}
                color="primary"
              >
                <Edit />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(derivedField.id)}
                color="error"
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Derived Field: {derivedField.label}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Field Label"
            value={derivedField.label}
            onChange={(e) => handleFieldUpdate({ label: e.target.value })}
            margin="normal"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={derivedField.required}
                onChange={(e) => handleFieldUpdate({ required: e.target.checked })}
              />
            }
            label="Required Field"
            sx={{ mt: 2, mb: 2 }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Parent Fields</InputLabel>
            <Select
              multiple
              value={derivedField.parentFields}
              onChange={handleParentFieldsChange}
              input={<OutlinedInput label="Parent Fields" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((fieldId) => {
                    const field = availableFields.find(f => f.id === fieldId);
                    return (
                      <Chip key={fieldId} label={field?.label || fieldId} size="small" />
                    );
                  })}
                </Box>
              )}
            >
              {availableFields.map((field) => (
                <MenuItem key={field.id} value={field.id}>
                  {field.label} ({field.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Formula"
            value={derivedField.formula}
            onChange={(e) => handleFieldUpdate({ formula: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            helperText="Examples: 'age', 'sum', 'concat'. For age calculation from date of birth, use 'age'."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DerivedFieldEditor;