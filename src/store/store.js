import { configureStore } from '@reduxjs/toolkit';
import quotationsReducer from './quotationsSlice';

export const store = configureStore({
  reducer: {
    quotations: quotationsReducer,
  },
});
