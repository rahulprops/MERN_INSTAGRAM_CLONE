import React, { Children, useEffect } from "react";
import { FiHome, FiSearch, FiCompass, FiMessageSquare, FiBell, FiPlusSquare, FiLogOut } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../redux/apis/userApi";
import { setAuthUsers } from "../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";



const Sidebar = () => {
const {user}=useSelector((store=>store.auth))
const dispatch=useDispatch()
const navigate=useNavigate()
// console.log(user)
const [logout,{isSuccess:isLogoutSucesss}]=useLogoutMutation()

    const sidebarHandler= async (textType)=>{
          // alert(textType)
          if(textType==='Logout'){
           await logout()

          }else if(textType==='Create'){
            navigate("/dashboard/create-post")
          }else if(textType==='Profile'){
            navigate(`/dashboard/profile/${user._id}`)
          }else if(textType==='Home'){
            navigate(`/dashboard`)
          }else if(textType==='Messages'){
            navigate(`/dashboard/chat`)
          }
    }

    useEffect(()=>{
      if(isLogoutSucesss){
       dispatch(setAuthUsers(null))
       navigate("/")
      }
    },[isLogoutSucesss])

    const sidebarItems = [
      { icon: <FiHome size={24} />, text: "Home" },
      { icon: <FiSearch size={24} />, text: "Search" },
      { icon: <FiCompass size={24} />, text: "Explore" },
      { icon: <FiMessageSquare size={24} />, text: "Messages" },
      { icon: <FiBell size={24} />, text: "Notifications" },
      { icon: <FiPlusSquare size={24} />, text: "Create" },
      { icon: <img src={user.profilePicture} alt="" className=" h-10 w-10 rounded-full" />, text: "Profile" },
      { icon: <FiLogOut size={24} />, text: "Logout" },
    ];
  
  return (
    <div className=" fixed top-0 w-64 h-screen bg-white shadow-lg flex flex-col items-start p-4">
      {/* Instagram Logo */}
      <h2 className="text-2xl font-bold mb-6">Instagram</h2>

      {/* Sidebar Items */}
      <ul className="space-y-4 w-full">
        {sidebarItems.map((item, index) => (
          <li
            key={index}
            onClick={()=>sidebarHandler(item.text)}
            className="flex items-center space-x-4 text-lg font-medium text-gray-700 hover:bg-gray-200 p-3 rounded-lg transition-all cursor-pointer"
          >
            {item.icon}
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
