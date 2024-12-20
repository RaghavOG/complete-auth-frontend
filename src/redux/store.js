import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Local storage
import authReducer from './authSlice';

// Redux Persist configuration
const persistConfig = {
  key: 'auth', // Target the auth slice
  storage,     // Use local storage
  whitelist: ['user', 'isAuthenticated'], // Persist these keys in the auth state
};

// Wrap the auth reducer with persistReducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// Create the store with persisted reducer
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  devTools: import.meta.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['auth._persist'], // Avoid issues with the persist flag
      },
    }),
});

const persistor = persistStore(store);

// Debugging: Log every state update
// store.subscribe(() => {
//   console.log('State updated:', store.getState());
// });

// persistor.subscribe(() => {
//   console.log('Persistor State:', store.getState());
// });

export { store, persistor };
