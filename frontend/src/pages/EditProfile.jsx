import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEditProfileMutation } from "../redux/apis/userApi";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [editProfile, { isLoading, isError, isSuccess }] = useEditProfileMutation();

  const [profilePic, setProfilePic] = useState(user.profilePicture);
  const [bio, setBio] = useState(user.bio);

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profilePicture", profilePic);
    formData.append("bio", bio);

    try {
      await editProfile(formData).unwrap();
      
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile. Try again.");
    }
  };
  useEffect(()=>{
  if(isSuccess){
    alert("Profile updated successfully!");
  }
  },[isSuccess])

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4">Edit Profile</h2>

      {/* Profile Picture Section */}
      <div className="flex items-center bg-gray-200 shadow-lg h-20 px-2 rounded-md justify-between">
        <div className="flex">
          <img
            src={profilePic instanceof File ? URL.createObjectURL(profilePic) : profilePic}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
          />
          <div className="ps-2">
            <div className="font-medium text-xl">{user.username}</div>
            <div>{user.bio}</div>
          </div>
        </div>
        <div>
          <input type="file" accept="image/*" className="hidden" id="profilePic" onChange={handleProfileChange} />
          <label htmlFor="profilePic" className="cursor-pointer px-4 py-1 text-sm bg-blue-400 rounded-md hover:bg-blue-300">
            Change Photo
          </label>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <button type="submit" className="px-5 py-2 float-end capitalize font-medium mt-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          {isLoading ? "Saving..." : "Submit"}
        </button>
      </form>

      {/* Feedback Messages */}
      {isSuccess && <p className="text-green-500 text-center mt-2">Profile updated successfully!</p>}
      {isError && <p className="text-red-500 text-center mt-2">Error updating profile. Try again.</p>}
    </div>
  );
};

export default EditProfile;
