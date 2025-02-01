import { configureStore} from '@reduxjs/toolkit'
import authSlice from './slice/authSlice'
import apiSlice from './apis/apiSlice';

const store=configureStore({
    reducer:{
        auth:authSlice,
        [apiSlice.reducerPath]:apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
})
export default store;