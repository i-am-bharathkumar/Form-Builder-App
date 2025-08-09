import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { loadSavedForms, deleteForm, setCurrentForm } from '../store/slices/formsSlice';
import { loadForm } from '../store/slices/formBuilderSlice';
import { loadFormsFromStorage, saveFormsToStorage } from '../utils/localStorage';
import { useState } from 'react';

const MyForms: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { savedForms } = useAppSelector(state => state.forms);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    const forms = loadFormsFromStorage();
    dispatch(loadSavedForms(forms));
  }, [dispatch]);

  const handlePreviewForm = (formId: string) => {
    const form = savedForms.find(f => f.id === formId);
    if (form) {
      dispatch(setCurrentForm(form));
      dispatch(loadForm({
        fields: form.fields,
        derivedFields: form.derivedFields,
        name: form.name,
      }));
      navigate('/preview');
    }
  };

  const handleDeleteForm = (formId: string) => {
    dispatch(deleteForm(formId));
    const updatedForms = savedForms.filter(form => form.id !== formId);
    saveFormsToStorage(updatedForms);
    setSnackbar({ open: true, message: 'Form deleted successfully', severity: 'success' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (savedForms.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <Typography variant="h5" gutterBottom color="text.secondary">
          No saved forms
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Create and save your first form to see it here
        </Typography>
        <Button variant="contained" onClick={() => navigate('/create')} sx={{ mt: 2 }}>
          Create New Form
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Forms
        </Typography>
        <Button variant="contained" onClick={() => navigate('/create')}>
          Create New Form
        </Button>
      </Box>

      <Grid container spacing={3}>
        {savedForms.map(form => (
          <Grid item xs={12} sm={6} md={4} key={form.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {form.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Created: {formatDate(form.createdAt)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Fields: {form.fields.length}
                  {form.derivedFields.length > 0 && (
                    <span> (+{form.derivedFields.length} derived)</span>
                  )}
                </Typography>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => handlePreviewForm(form.id)}
                  variant="contained"
                >
                  Preview
                </Button>
                
                <IconButton
                  size="small"
                  onClick={() => handleDeleteForm(form.id)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

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

export default MyForms;