import React, { useEffect, useState } from "react";
import { useLoginMutation } from "../../redux/apis/userApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [login, { data, isSuccess, isError, error, isLoading }] = useLoginMutation();
  const navigate=useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginHandle = async (e) => {
    e.preventDefault();
    try {
      await login(formData).unwrap();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  useEffect(()=>{
      if(isSuccess){
        navigate("/dashboard")
      }
  },[isSuccess])
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Login</h2>
        {isError && <p className="text-red-500 text-center">{error?.data?.message || "Login failed"}</p>}
        {isSuccess && <p className="text-green-500 text-center">Login successful!</p>}
        <form className="space-y-4" onSubmit={loginHandle}>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
