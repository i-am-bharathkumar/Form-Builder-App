export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password';
  value?: number;
  message: string;
}

export interface BaseField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  defaultValue?: any;
  validationRules: ValidationRule[];
}

export interface TextField extends BaseField {
  type: 'text';
  defaultValue?: string;
}

export interface NumberField extends BaseField {
  type: 'number';
  defaultValue?: number;
}

export interface TextareaField extends BaseField {
  type: 'textarea';
  defaultValue?: string;
}

export interface SelectField extends BaseField {
  type: 'select';
  options: string[];
  defaultValue?: string;
}

export interface RadioField extends BaseField {
  type: 'radio';
  options: string[];
  defaultValue?: string;
}

export interface CheckboxField extends BaseField {
  type: 'checkbox';
  defaultValue?: boolean;
}

export interface DateField extends BaseField {
  type: 'date';
  defaultValue?: string;
}

export type FormField = TextField | NumberField | TextareaField | SelectField | RadioField | CheckboxField | DateField;

export interface DerivedField extends Omit<BaseField, 'defaultValue'> {
  isDerived: true;
  parentFields: string[];
  formula: string;
  computedValue?: any;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  derivedFields: DerivedField[];
  createdAt: string;
}

export interface FormValidationError {
  fieldId: string;
  message: string;
}

export interface FormData {
  [fieldId: string]: any;
}