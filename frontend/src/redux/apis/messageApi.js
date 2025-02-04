import { setMessages } from "../slice/chatSlice";
import apiSlice from "./apiSlice";

const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (receiverId) => ({
        url: `message/get/${receiverId}`,
        method: "GET",
      }),
      transformResponse: (data) => {
        return data;
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled; // ✅ Await the promise
          const result = data.messages;
          dispatch(setMessages(result));
        } catch (error) {
          console.error("get messages:", error);
        }
      },
      providesTags:["refesh_message"]
    }),
    sendMessage:builder.mutation({
        query:({receiverId,message})=>({
            url:`message/create/${receiverId}`,
            method:"POST",
            body:{message}
        }),
        transformResponse: (data) => {
            return data.data;
          },
          invalidatesTags:["refesh_message"]
    })
  }),
});
export const {useLazyGetMessagesQuery,useSendMessageMutation}=messageApi;
