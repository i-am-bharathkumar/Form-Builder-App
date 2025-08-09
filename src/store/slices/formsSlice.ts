import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormSchema } from '../../types/form';

interface FormsState {
  savedForms: FormSchema[];
  currentForm: FormSchema | null;
}

const initialState: FormsState = {
  savedForms: [],
  currentForm: null,
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    loadSavedForms: (state, action: PayloadAction<FormSchema[]>) => {
      state.savedForms = action.payload;
    },
    
    saveForm: (state, action: PayloadAction<FormSchema>) => {
      const existingIndex = state.savedForms.findIndex(form => form.id === action.payload.id);
      if (existingIndex !== -1) {
        state.savedForms[existingIndex] = action.payload;
      } else {
        state.savedForms.push(action.payload);
      }
    },
    
    deleteForm: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter(form => form.id !== action.payload);
    },
    
    setCurrentForm: (state, action: PayloadAction<FormSchema | null>) => {
      state.currentForm = action.payload;
    },
  },
});

export const {
  loadSavedForms,
  saveForm,
  deleteForm,
  setCurrentForm,
} = formsSlice.actions;

export default formsSlice.reducer;