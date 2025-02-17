import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";

import MainLayout from "./Layout/MainLayout";
import Login from "./componets/ui/Login";
import Signup from "./componets/ui/Signup";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChatPage from "./pages/ChatPage";

import { setSocket } from "./redux/slice/socketSlice";
import { setOnlineUsers } from "./redux/slice/chatSlice";

function App() {
  const { user } = useSelector((store) => store.auth);
  const isAuthenticated = !!user; // Fix: Determine authentication status dynamically

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:9076", {
        query: { userId: user._id },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      // Listen to the event for online users
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => {
        socketio.disconnect();
        dispatch(setOnlineUsers(null));
      };
    }
  }, [user, dispatch]);

  return (
    <Router>
      <Routes>
        {/* Default route to Login */}
        <Route path="/" element={<Login />} />

        {/* Signup Route */}
        <Route path="/signup" element={<Signup />} />

        {/* Protected Route: Main Layout */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/" />}
        >
          <Route index element={<Home />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
