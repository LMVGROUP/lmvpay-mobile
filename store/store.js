import { configureStore } from '@reduxjs/toolkit';
import HealthReducer from './healthSlice'


export const store = configureStore({
  reducer: {
    health : HealthReducer
  },
});
