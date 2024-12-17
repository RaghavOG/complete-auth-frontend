import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from './authSlice';

const persistConfig = {
  key: 'root', 
  storage, 
  whitelist: ['auth'], 
 
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, 
  },
  devTools: import.meta.env.NODE_ENV !== 'production', 
});

const persistor = persistStore(store);

export { store, persistor };
