import { setAuthUsers } from "../slice/authSlice";
import apiSlice from "./apiSlice";

const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (inputData) => ({
                url: "/user/login",
                method: "POST",
                body: inputData
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const {data}  = await queryFulfilled; // ✅ Await the promise
                    const result=data.data
                    dispatch(setAuthUsers(result));
                } catch (error) {
                    console.error("Login API Error:", error);
                }
            }
        }),
        logout:builder.mutation({
            query:()=>({
                url:"/user/logout",
                method:"POST"
            })
        })
    })
});

export const { useLoginMutation,useLogoutMutation } = userApi;
