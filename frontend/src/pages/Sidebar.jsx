import React from "react";
import { FiHome, FiSearch, FiCompass, FiMessageSquare, FiBell, FiPlusSquare, FiLogOut } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";

const sidebarItems = [
  { icon: <FiHome size={24} />, text: "Home" },
  { icon: <FiSearch size={24} />, text: "Search" },
  { icon: <FiCompass size={24} />, text: "Explore" },
  { icon: <FiMessageSquare size={24} />, text: "Messages" },
  { icon: <FiBell size={24} />, text: "Notifications" },
  { icon: <FiPlusSquare size={24} />, text: "Create" },
  { icon: <FaRegUserCircle size={24} />, text: "Profile" },
  { icon: <FiLogOut size={24} />, text: "Logout" },
];

const Sidebar = () => {


    const sidebarHandler=(textType)=>{
          alert(textType)
    }

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
