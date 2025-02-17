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
            },
        
        }),
        logout:builder.mutation({
            query:()=>({
                url:"/user/logout",
                method:"POST"
            })
        }),
        suggestedUsers:builder.query({
            query:()=>({
                url:"/user/suggested-users",
                method:"GET"
            }),
            transformResponse:(data)=>{
                return data.data
              },
        }),
        getProfile:builder.query({
            query:(id)=>({
                url:`/user/get-profile/${id}`,
                method:"GET"
            }),
            transformResponse:(data)=>{
                return data.data
              },
        }),
        editProfile:builder.mutation({
            query:(formData)=>({
                url:"/user/edit-profile",
                method:"put",
                body:formData
            }),
            
            
        })
    })
});

export const { useLoginMutation,useLogoutMutation , useSuggestedUsersQuery,useLazyGetProfileQuery,useEditProfileMutation} = userApi;
