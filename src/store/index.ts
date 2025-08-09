import { configureStore } from '@reduxjs/toolkit';
import formBuilderReducer from './slices/formBuilderSlice';
import formsReducer from './slices/formsSlice';

export const store = configureStore({
  reducer: {
    formBuilder: formBuilderReducer,
    forms: formsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;