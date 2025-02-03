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
              },
              providesTags: ["refresh_list"],
        }),
        
        addComments:builder.mutation({
          query:({postId, text})=>({
            url:`/post/add-comment/${postId}`,
            method:"POST",
            body:{text}
          }),
          invalidatesTags:["refresh_list"],
        }),
        likeOrDislike:builder.mutation({
          query:({action,postId})=>({
            url:`/post/${action}/${postId}`,
            method:"POST"
          })
        })
    })
})
export const {useCreatePostMutation,useListPostQuery,useAddCommentsMutation,useLikeOrDislikeMutation}=postApi;