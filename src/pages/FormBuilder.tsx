import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, Save } from '@mui/icons-material';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import {
  addField,
  updateField,
  deleteField,
  reorderFields,
  addDerivedField,
  updateDerivedField,
  deleteDerivedField,
  setCurrentFormName,
  clearForm,
} from '../store/slices/formBuilderSlice';
import { saveForm, loadSavedForms } from '../store/slices/formsSlice';
import { saveFormsToStorage, loadFormsFromStorage } from '../utils/localStorage';
import FieldEditor from '../components/FieldEditor';
import DerivedFieldEditor from '../components/DerivedFieldEditor';
import { FormField, DerivedField, FormSchema } from '../types/form';
import { v4 as uuidv4 } from 'uuid';

const FormBuilder: React.FC = () => {
  const dispatch = useAppDispatch();
  const { fields, derivedFields, currentFormName } = useAppSelector(state => state.formBuilder);
  const { savedForms } = useAppSelector(state => state.forms);

  const [addFieldDialogOpen, setAddFieldDialogOpen] = useState(false);
  const [addDerivedFieldDialogOpen, setAddDerivedFieldDialogOpen] = useState(false);
  const [saveFormDialogOpen, setSaveFormDialogOpen] = useState(false);
  const [newFieldType, setNewFieldType] = useState<FormField['type']>('text');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [formNameInput, setFormNameInput] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);

  useEffect(() => {
    const forms = loadFormsFromStorage();
    dispatch(loadSavedForms(forms));
  }, [dispatch]);

  const handleAddField = () => {
    if (newFieldLabel.trim()) {
      const baseField = {
        type: newFieldType,
        label: newFieldLabel.trim(),
        required: false,
        validationRules: [],
      };

      // Add type-specific properties
      let fieldToAdd: Omit<FormField, 'id'>;
      
      if (newFieldType === 'select' || newFieldType === 'radio') {
        fieldToAdd = { ...baseField, options: ['Option 1', 'Option 2'] };
      } else {
        fieldToAdd = baseField;
      }

      dispatch(addField(fieldToAdd));
      setNewFieldLabel('');
      setAddFieldDialogOpen(false);
      setSnackbar({ open: true, message: 'Field added successfully', severity: 'success' });
    }
  };

  const handleAddDerivedField = () => {
    if (newFieldLabel.trim()) {
      const derivedField: Omit<DerivedField, 'id'> = {
        type: 'text',
        label: newFieldLabel.trim(),
        required: false,
        validationRules: [],
        isDerived: true,
        parentFields: [],
        formula: '',
      };

      dispatch(addDerivedField(derivedField));
      setNewFieldLabel('');
      setAddDerivedFieldDialogOpen(false);
      setSnackbar({ open: true, message: 'Derived field added successfully', severity: 'success' });
    }
  };

  const handleSaveForm = () => {
    if (!formNameInput.trim()) {
      setSnackbar({ open: true, message: 'Please enter a form name', severity: 'error' });
      return;
    }

    if (fields.length === 0) {
      setSnackbar({ open: true, message: 'Please add at least one field', severity: 'error' });
      return;
    }

    const formSchema: FormSchema = {
      id: uuidv4(),
      name: formNameInput.trim(),
      fields,
      derivedFields,
      createdAt: new Date().toISOString(),
    };

    dispatch(saveForm(formSchema));
    dispatch(setCurrentFormName(formNameInput.trim()));

    // Update localStorage
    const updatedForms = [...savedForms, formSchema];
    saveFormsToStorage(updatedForms);

    setSaveFormDialogOpen(false);
    setFormNameInput('');
    setSnackbar({ open: true, message: 'Form saved successfully', severity: 'success' });
  };

  const handleClearForm = () => {
    dispatch(clearForm());
    setSnackbar({ open: true, message: 'Form cleared', severity: 'success' });
  };

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    setDraggedFieldId(fieldId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (!draggedFieldId) return;

    const draggedIndex = fields.findIndex(field => field.id === draggedFieldId);
    if (draggedIndex === -1) return;

    const reorderedFields = [...fields];
    const [draggedField] = reorderedFields.splice(draggedIndex, 1);
    reorderedFields.splice(targetIndex, 0, draggedField);

    dispatch(reorderFields(reorderedFields));
    setDraggedFieldId(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Form Builder
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={handleClearForm}>
            Clear Form
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => setSaveFormDialogOpen(true)}
            disabled={fields.length === 0}
          >
            Save Form
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, minHeight: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Form Fields
            </Typography>

            {fields.length === 0 && derivedFields.length === 0 ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '300px',
                  color: 'text.secondary' 
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No fields added yet
                </Typography>
                <Typography variant="body2">
                  Click the "Add Field" button to start building your form
                </Typography>
              </Box>
            ) : (
              <Box>
                {fields.map((field, index) => (
                  <Box
                    key={field.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <FieldEditor
                      field={field}
                      onUpdate={(updatedField) => dispatch(updateField(updatedField))}
                      onDelete={(fieldId) => dispatch(deleteField(fieldId))}
                      onDragStart={handleDragStart}
                    />
                  </Box>
                ))}

                {derivedFields.map((derivedField) => (
                  <DerivedFieldEditor
                    key={derivedField.id}
                    derivedField={derivedField}
                    availableFields={fields}
                    onUpdate={(updatedField) => dispatch(updateDerivedField(updatedField))}
                    onDelete={(fieldId) => dispatch(deleteDerivedField(fieldId))}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add Fields
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAddFieldDialogOpen(true)}
                fullWidth
              >
                Add Field
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setAddDerivedFieldDialogOpen(true)}
                color="secondary"
                fullWidth
                disabled={fields.length === 0}
              >
                Add Derived Field
              </Button>
            </Box>

            {currentFormName && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Current Form: <strong>{currentFormName}</strong>
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Add Field Dialog */}
      <Dialog open={addFieldDialogOpen} onClose={() => setAddFieldDialogOpen(false)}>
        <DialogTitle>Add New Field</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Field Type</InputLabel>
            <Select
              value={newFieldType}
              label="Field Type"
              onChange={(e) => setNewFieldType(e.target.value as FormField['type'])}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="textarea">Textarea</MenuItem>
              <MenuItem value="select">Select</MenuItem>
              <MenuItem value="radio">Radio</MenuItem>
              <MenuItem value="checkbox">Checkbox</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Field Label"
            value={newFieldLabel}
            onChange={(e) => setNewFieldLabel(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddFieldDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddField} variant="contained">Add Field</Button>
        </DialogActions>
      </Dialog>

      {/* Add Derived Field Dialog */}
      <Dialog open={addDerivedFieldDialogOpen} onClose={() => setAddDerivedFieldDialogOpen(false)}>
        <DialogTitle>Add Derived Field</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Field Label"
            value={newFieldLabel}
            onChange={(e) => setNewFieldLabel(e.target.value)}
            margin="normal"
            helperText="This field will compute its value based on other fields"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDerivedFieldDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddDerivedField} variant="contained">Add Field</Button>
        </DialogActions>
      </Dialog>

      {/* Save Form Dialog */}
      <Dialog open={saveFormDialogOpen} onClose={() => setSaveFormDialogOpen(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Form Name"
            value={formNameInput}
            onChange={(e) => setFormNameInput(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveFormDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveForm} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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

export default FormBuilder;