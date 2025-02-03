import React from "react";
import { useSelector } from "react-redux";
import { useSuggestedUsersQuery } from "../redux/apis/userApi";

const RightSidebar = () => {
  // Dummy data for suggested users
  const {user}=useSelector((store=>store.auth))
  const {data,isLoading,isError,isSuccess,error}=useSuggestedUsersQuery()
  const suggestedUsers = [
    { id: 1, name: "John Doe", username: "johndoe", profilePic: "https://via.placeholder.com/50" },
    { id: 2, name: "Jane Smith", username: "janesmith", profilePic: "https://via.placeholder.com/50" },
    { id: 3, name: "Michael Brown", username: "michaelbrown", profilePic: "https://via.placeholder.com/50" },
  ];
  if(isLoading) return <div>loading</div>

  return (
    <div className="w-80 p-4 ">
      {/* User Profile */}
      <div className="flex items-center space-x-3 mb-6">
        <img
          src={user.profilePicture}
          alt="User Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold capitalize">{user.username}</p>
          <p className="text-sm text-gray-500 capitalize">{user.bio}</p>
        </div>
      </div>

      {/* Suggestions Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-gray-700">Suggestions for you</p>
        <button className="text-blue-500 text-sm font-medium">See All</button>
      </div>

      {/* Suggested Users */}
      <div className="space-y-4">
        {data.map((user) => (
          <div key={user._id} className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src={user.profilePicture} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-semibold capitalize">{user.username}</p>
                <p className="text-sm text-gray-500">{user.bio}</p>
              </div>
            </div>
            <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
