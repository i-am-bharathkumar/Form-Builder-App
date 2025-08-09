import { FormSchema } from '../types/form';

const FORMS_STORAGE_KEY = 'formBuilder_savedForms';

export const saveFormsToStorage = (forms: FormSchema[]): void => {
  try {
    localStorage.setItem(FORMS_STORAGE_KEY, JSON.stringify(forms));
  } catch (error) {
    console.error('Error saving forms to localStorage:', error);
  }
};

export const loadFormsFromStorage = (): FormSchema[] => {
  try {
    const formsJson = localStorage.getItem(FORMS_STORAGE_KEY);
    return formsJson ? JSON.parse(formsJson) : [];
  } catch (error) {
    console.error('Error loading forms from localStorage:', error);
    return [];
  }
};

export const deleteFormFromStorage = (formId: string): void => {
  try {
    const forms = loadFormsFromStorage();
    const updatedForms = forms.filter(form => form.id !== formId);
    saveFormsToStorage(updatedForms);
  } catch (error) {
    console.error('Error deleting form from localStorage:', error);
  }
};