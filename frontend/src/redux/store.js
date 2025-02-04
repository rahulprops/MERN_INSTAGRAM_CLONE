import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authSlice from "./slice/authSlice";
import apiSlice from "./apis/apiSlice";
import socketSlice from "./slice/socketSlice";
import chatSlice from "./slice/chatSlice";

// Persist Config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "chat"], // Removed 'socketio' to prevent errors
};

// Combine Reducers
const rootReducer = combineReducers({
  auth: authSlice,
  socketio: socketSlice, // Kept in store but NOT persisted
  chat: chatSlice,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// Persist Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Keeps persist functionality
        ignoredPaths: ["socketio.socket"], // ✅ Ignore non-serializable WebSocket object
        ignoredActions: ["persist/PERSIST"], // ✅ Ensure Redux Persist still works
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
export default store;
