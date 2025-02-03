import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import MainLayout from "./Layout/MainLayout";
import Login from "./componets/ui/Login";
import Signup from "./componets/ui/Signup";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChatPage from "./pages/ChatPage";
import { useDispatch, useSelector } from "react-redux";
import io from 'socket.io-client'
import { setSocket } from "./redux/slice/socketSlice";
import { setOnlineUsers } from "./redux/slice/chatSlice";

function App() {
  const {user}=useSelector((store=>store.auth))
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const dispatch=useDispatch()
    
  useEffect(()=>{
     if(user){
       const socketio=io('http://localhost:9076',{
        query:{
          userId:user?._id
        },
        transports:['websocket']
       })
       dispatch(setSocket(socketio));

       // listen all the events
       socketio.on('getOnlineUsers',(onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
       })

       return ()=>{
        socketio.close()
        dispatch(setOnlineUsers(null))
       }
     }else{
      socketio.close()
      dispatch(setSocket(null))
     }
  },[user,dispatch])

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
          <Route index element={<Home/>} />
          <Route path="/dashboard/create-post" element={<CreatePost/>} />
          <Route path="/dashboard/profile/:id" element={<Profile/>} />
          <Route path="/dashboard/edit-profile" element={<EditProfile/>} />
          <Route path="/dashboard/chat" element={<ChatPage/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
