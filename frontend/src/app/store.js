import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../reducers/authSlice'; // Import your authReducer
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // LocalStorage as default
import { createTransform } from 'redux-persist'; // Import createTransform
import { orderReducer } from '../reducers/orderSlice';


const dataTransform = createTransform(
  (inboundState) => {
    // eslint-disable-next-line no-unused-vars
    const { loading, error, ...rest } = inboundState;    
    return rest;
  },
  (outboundState) => outboundState,
);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'order'], // Only persist 'auth' slice
  transforms: [dataTransform], // Apply the custom transform to 'auth'
  version: 1,
};

// Combine your reducers (currently just authReducer, but add more slices as necessary)
const rootReducer = combineReducers({
  auth: authReducer,
  order: orderReducer,
})

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store); // Create the persistor to handle rehydration

export { store, persistor };
