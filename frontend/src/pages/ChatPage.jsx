import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSuggestedUsersQuery } from "../redux/apis/userApi";
import { setSelectedUser } from "../redux/slice/authSlice";
import { useLazyGetMessagesQuery, useSendMessageMutation } from "../redux/apis/messageApi";
import { setMessages } from "../redux/slice/chatSlice";
import useGetRTM from "../hooks/useGetRTM";

const ChatPage = () => {
  useGetRTM()
  const dispatch = useDispatch();
  const { user, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const { data: users, isLoading, isError, error } = useSuggestedUsersQuery();
  console.log(messages)
  const [getMessages, { data: fetchedMessages }] = useLazyGetMessagesQuery();
  const [sendMessage, { data: sendMessData, isSuccess: sendMessSuccess }] = useSendMessageMutation();

  const [messagestext, setMessagestext] = useState("");

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  

  // Update messages when a new message is sent
  useEffect(() => {
    if (sendMessSuccess && sendMessData) {
      dispatch(setMessages([...messages, sendMessData]));
      setMessagestext(""); // Clear input after sending
    }
  }, [sendMessSuccess, sendMessData, dispatch]);

  const handleSendMessage = (receiverId) => {
    if (messagestext.trim() === "") return;
    sendMessage({ receiverId, message: messagestext });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar - User List */}
      <div className="w-1/4 bg-gray-100 border-r p-4">
        <h2 className="text-lg font-semibold mb-4 capitalize">{user?.username}</h2>

        {isLoading && <p>Loading chats...</p>}
        {isError && <p className="text-red-500">Error: {error?.message}</p>}

        {users?.length > 0 ? (
          users.map((usr) => {
            const isOnline = onlineUsers?.includes(usr?._id);
            return (
              <div
                key={usr._id}
                className={`flex items-center p-2 cursor-pointer hover:bg-gray-200 rounded-md ${
                  selectedUser?._id === usr._id ? "bg-gray-300" : ""
                }`}
                onClick={() => dispatch(setSelectedUser(usr))}
              >
                <img src={usr.profilePicture} alt={usr.username} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <p className="font-medium capitalize">{usr.username}</p>
                  <p className={`text-sm capitalize ${isOnline ? "text-green-500" : "text-gray-500"}`}>
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No users found</p>
        )}
      </div>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-gray-200 p-4 flex items-center border-b">
              <img
                src={selectedUser?.profilePicture}
                alt={selectedUser?.username}
                className="w-10 h-10 rounded-full mr-3"
              />
              <h2 className="text-lg font-semibold">{selectedUser?.username}</h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages?.length > 0 ? (
                messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.senderId?._id === user?._id ? "justify-end" : "justify-start"} mb-2`}>
                    <p
                      className={`px-4 py-2 rounded-md ${
                        msg.senderId?._id === user?._id ? "bg-blue-500 text-white" : "bg-gray-300"
                      }`}
                    >
                      {msg.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No messages yet</p>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t flex items-center bg-gray-100">
              <input
                type="text"
                className="flex-1 p-2 border rounded-md focus:outline-none"
                placeholder="Type a message..."
                value={messagestext}
                onChange={(e) => setMessagestext(e.target.value)}
              />
              <button
                onClick={() => handleSendMessage(selectedUser._id)}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
