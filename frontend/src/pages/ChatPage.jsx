import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSuggestedUsersQuery } from "../redux/apis/userApi";
import { setSelectedUser } from "../redux/slice/authSlice";

const ChatPage = () => {
  const { user, selectedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { data: users, isLoading, isError, error } = useSuggestedUsersQuery();

  const [messages, setMessages] = useState([
    { sender: "me", text: "Hey, how are you?" },
    { sender: "them", text: "I'm good! What about you?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { sender: "me", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar - User List */}
      <div className="w-1/4 bg-gray-100 border-r p-4">
        <h2 className="text-lg font-semibold mb-4 capitalize">{user?.username}</h2>

        {isLoading && <p>Loading chats...</p>}
        {isError && <p className="text-red-500">Error loading users: {error?.message}</p>}

        {users?.length > 0 ? (
          users.map((usr) => (
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
                <p className="text-sm capitalize text-gray-500">
                  {usr.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gray-200 p-4 flex items-center border-b">
          {selectedUser ? (
            <>
              <img
                src={selectedUser?.profilePicture}
                alt={selectedUser?.username}
                className="w-10 h-10 rounded-full mr-3"
              />
              <h2 className="text-lg font-semibold">{selectedUser?.username}</h2>
            </>
          ) : (
            <p>Select a user to chat</p>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} mb-2`}
            >
              <p
                className={`px-4 py-2 rounded-md ${
                  msg.sender === "me" ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
              >
                {msg.text}
              </p>
            </div>
          ))}
        </div>

        {/* Message Input */}
        {selectedUser && (
          <div className="p-4 border-t flex items-center bg-gray-100">
            <input
              type="text"
              className="flex-1 p-2 border rounded-md focus:outline-none"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
