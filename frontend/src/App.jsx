import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import MainLayout from "./Layout/MainLayout";
import Login from "./componets/ui/Login";
import Signup from "./componets/ui/Signup";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
