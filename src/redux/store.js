import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Local storage
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import authReducer from './authSlice';

// Redux Persist configuration
const persistConfig = {
  key: 'auth', 
  storage,     
  // whitelist: ['user', 'isAuthenticated'], 
};


const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  // devTools: import.meta.env.NODE_ENV !== 'production',
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
  //       ignoredPaths: ['auth._persist'], // Avoid issues with the persist flag
  //     },
  //   }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
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
