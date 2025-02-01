import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authSlice from './slice/authSlice';
import apiSlice from './apis/apiSlice';

// Persist Config
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'], // Persist only the auth slice
};

// Combine Reducers
const rootReducer = combineReducers({
    auth: authSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
});

// Persist Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for redux-persist
        }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
export default store;
