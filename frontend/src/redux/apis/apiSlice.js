import {createApi ,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const BASE_URL="http://localhost:9076/api"

const apiSlice=createApi({
    reducerPath:'api',
    baseQuery:fetchBaseQuery({
        baseUrl:BASE_URL,
        credentials:'include'
    }),
    endpoints:()=>({})
})
export default apiSlice;