import apiSlice from "./apiSlice";

const postApi=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        createPost:builder.mutation({
            query:(formData)=>({
                url:"/post/create",
                method:"POST",
                body:formData
            })
        })
    })
})
export const {useCreatePostMutation}=postApi;