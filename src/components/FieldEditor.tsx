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
  Divider,
} from '@mui/material';
import { Delete, Edit, Add, DragIndicator } from '@mui/icons-material';
import { FormField, ValidationRule } from '../types/form';

interface FieldEditorProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  onDragStart?: (e: React.DragEvent, fieldId: string) => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  onUpdate,
  onDelete,
  onDragStart,
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [newValidationRule, setNewValidationRule] = useState<Partial<ValidationRule>>({
    type: 'required',
    message: '',
  });

  const handleFieldUpdate = (updates: Partial<FormField>) => {
    onUpdate({ ...field, ...updates });
  };

  const handleAddValidationRule = () => {
    if (newValidationRule.type && newValidationRule.message) {
      const updatedRules = [
        ...field.validationRules,
        newValidationRule as ValidationRule,
      ];
      handleFieldUpdate({ validationRules: updatedRules });
      setNewValidationRule({ type: 'required', message: '' });
      setValidationDialogOpen(false);
    }
  };

  const handleRemoveValidationRule = (index: number) => {
    const updatedRules = field.validationRules.filter((_, i) => i !== index);
    handleFieldUpdate({ validationRules: updatedRules });
  };

  const renderFieldSpecificOptions = () => {
    switch (field.type) {
      case 'select':
      case 'radio':
        const selectField = field as FormField & { options: string[] };
        return (
          <TextField
            fullWidth
            label="Options (comma-separated)"
            value={selectField.options?.join(', ') || ''}
            onChange={(e) => {
              const options = e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt);
              handleFieldUpdate({ options });
            }}
            margin="normal"
            helperText="Enter options separated by commas"
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card 
        sx={{ mb: 2, border: '1px solid #e0e0e0', '&:hover': { boxShadow: 2 } }}
        draggable
        onDragStart={(e) => onDragStart?.(e, field.id)}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <IconButton
              size="small"
              sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
            >
              <DragIndicator />
            </IconButton>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                {field.label}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip label={field.type} size="small" color="primary" />
                {field.required && (
                  <Chip label="Required" size="small" color="error" />
                )}
              </Box>

              {field.validationRules.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Validation Rules:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {field.validationRules.map((rule, index) => (
                      <Chip
                        key={index}
                        label={`${rule.type}${rule.value ? `: ${rule.value}` : ''}`}
                        size="small"
                        variant="outlined"
                        onDelete={() => handleRemoveValidationRule(index)}
                      />
                    ))}
                  </Box>
                </Box>
              )}
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
                onClick={() => onDelete(field.id)}
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
        <DialogTitle>Edit Field: {field.label}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Field Label"
            value={field.label}
            onChange={(e) => handleFieldUpdate({ label: e.target.value })}
            margin="normal"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={field.required}
                onChange={(e) => handleFieldUpdate({ required: e.target.checked })}
              />
            }
            label="Required Field"
            sx={{ mt: 2, mb: 2 }}
          />

          {renderFieldSpecificOptions()}

          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Validation Rules</Typography>
            <Button
              startIcon={<Add />}
              onClick={() => setValidationDialogOpen(true)}
              variant="outlined"
              size="small"
            >
              Add Rule
            </Button>
          </Box>

          {field.validationRules.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {field.validationRules.map((rule, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="body2">
                    {rule.type}{rule.value ? ` (${rule.value})` : ''}: {rule.message}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveValidationRule(index)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No validation rules added yet.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Validation Rule Dialog */}
      <Dialog open={validationDialogOpen} onClose={() => setValidationDialogOpen(false)}>
        <DialogTitle>Add Validation Rule</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Rule Type</InputLabel>
            <Select
              value={newValidationRule.type || ''}
              label="Rule Type"
              onChange={(e) => setNewValidationRule({ ...newValidationRule, type: e.target.value as any })}
            >
              <MenuItem value="required">Required</MenuItem>
              <MenuItem value="minLength">Minimum Length</MenuItem>
              <MenuItem value="maxLength">Maximum Length</MenuItem>
              <MenuItem value="email">Email Format</MenuItem>
              <MenuItem value="password">Password (8+ chars, 1 number)</MenuItem>
            </Select>
          </FormControl>

          {(newValidationRule.type === 'minLength' || newValidationRule.type === 'maxLength') && (
            <TextField
              fullWidth
              type="number"
              label="Length Value"
              value={newValidationRule.value || ''}
              onChange={(e) => setNewValidationRule({ ...newValidationRule, value: parseInt(e.target.value) })}
              margin="normal"
            />
          )}

          <TextField
            fullWidth
            label="Error Message"
            value={newValidationRule.message || ''}
            onChange={(e) => setNewValidationRule({ ...newValidationRule, message: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValidationDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddValidationRule} variant="contained">Add Rule</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FieldEditor;