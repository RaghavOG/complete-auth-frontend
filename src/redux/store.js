import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js'; 

// Create and configure the store
const store = configureStore({
  reducer: {
    auth: authReducer, 
  },
});

export default store;
