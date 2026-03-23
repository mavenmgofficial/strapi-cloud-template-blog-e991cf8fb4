import { configureStore } from '@reduxjs/toolkit';
import { strapiApi } from '../services/strapiApi';

export const store = configureStore({
  reducer: {
    [strapiApi.reducerPath]: strapiApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(strapiApi.middleware),
});
