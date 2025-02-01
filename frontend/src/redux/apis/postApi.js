import apiSlice from "./apiSlice";

const postApi=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        createPost:builder.mutation({
            query:(formData)=>({
                url:"/post/create",
                method:"POST",
                body:formData
            })
        }),
        listPost:builder.query({
              query:()=>({
                url:"/post/all-posts",
                method:"GET",
                
              }),
              transformResponse:(data)=>{
                return data.data
              }
        })
    })
})
export const {useCreatePostMutation,useListPostQuery}=postApi;