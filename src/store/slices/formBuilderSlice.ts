import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField, DerivedField, ValidationRule } from '../../types/form';
import { v4 as uuidv4 } from 'uuid';

interface FormBuilderState {
  fields: FormField[];
  derivedFields: DerivedField[];
  currentFormName: string;
}

const initialState: FormBuilderState = {
  fields: [],
  derivedFields: [],
  currentFormName: '',
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<Omit<FormField, 'id'>>) => {
      const newField: FormField = {
        ...action.payload,
        id: uuidv4(),
      };
      state.fields.push(newField);
    },
    
    updateField: (state, action: PayloadAction<FormField>) => {
      const index = state.fields.findIndex(field => field.id === action.payload.id);
      if (index !== -1) {
        state.fields[index] = action.payload;
      }
    },
    
    deleteField: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter(field => field.id !== action.payload);
      // Remove derived fields that depend on this field
      state.derivedFields = state.derivedFields.filter(
        derivedField => !derivedField.parentFields.includes(action.payload)
      );
    },
    
    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      state.fields = action.payload;
    },
    
    addDerivedField: (state, action: PayloadAction<Omit<DerivedField, 'id'>>) => {
      const newDerivedField: DerivedField = {
        ...action.payload,
        id: uuidv4(),
      };
      state.derivedFields.push(newDerivedField);
    },
    
    updateDerivedField: (state, action: PayloadAction<DerivedField>) => {
      const index = state.derivedFields.findIndex(field => field.id === action.payload.id);
      if (index !== -1) {
        state.derivedFields[index] = action.payload;
      }
    },
    
    deleteDerivedField: (state, action: PayloadAction<string>) => {
      state.derivedFields = state.derivedFields.filter(field => field.id !== action.payload);
    },
    
    setCurrentFormName: (state, action: PayloadAction<string>) => {
      state.currentFormName = action.payload;
    },
    
    loadForm: (state, action: PayloadAction<{ fields: FormField[], derivedFields: DerivedField[], name: string }>) => {
      state.fields = action.payload.fields;
      state.derivedFields = action.payload.derivedFields;
      state.currentFormName = action.payload.name;
    },
    
    clearForm: (state) => {
      state.fields = [];
      state.derivedFields = [];
      state.currentFormName = '';
    },
  },
});

export const {
  addField,
  updateField,
  deleteField,
  reorderFields,
  addDerivedField,
  updateDerivedField,
  deleteDerivedField,
  setCurrentFormName,
  loadForm,
  clearForm,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;