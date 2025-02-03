import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLazyGetProfileQuery } from "../redux/apis/userApi";
import { useSelector } from "react-redux";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const { id } = useParams();
  const {user}=useSelector((store=>store.auth))
  const [getProfile, { data: profile, isLoading }] = useLazyGetProfileQuery();

  useEffect(() => {
    getProfile(id);
  }, [id]);

  if (isLoading) return <div className="text-center text-lg">Loading...</div>;
  if (!profile) return <div className="text-center text-lg">User not found</div>;
  const isLoggedInUserProfile = user._id===profile._id;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="flex items-center space-x-6">
        <img
          src={profile?.profilePicture || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-gray-300"
        />
        <div>
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold capitalize">{profile?.username}</h2>
            {isLoggedInUserProfile ? (
              <button className="px-4 py-1 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">
                Edit Profile
              </button>
            ) : isFollowing ? (
              <>
                <button className="px-4 py-1 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">
                  Unfollow
                </button>
                <button className="px-4 py-1 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">
                  Message
                </button>
              </>
            ) : (
              <button className="px-4 py-1 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300">
                Follow
              </button>
            )}
          </div>
          <div className="flex space-x-6 mt-3">
            <p><span className="font-semibold">{profile?.posts?.length || 0}</span> posts</p>
            <p><span className="font-semibold">{profile?.followers?.length || 0}</span> followers</p>
            <p><span className="font-semibold">{profile?.following?.length || 0}</span> following</p>
          </div>
          <p className="mt-3 capitalize text-gray-700">{profile?.bio}</p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-6 border-t border-gray-300">
        <div className="flex justify-center space-x-10 py-3">
          {["posts", "saved", "tagged"].map((tab) => (
            <button
              key={tab}
              className={`text-sm font-medium ${
                activeTab === tab ? "border-b-2 border-black" : "text-gray-500"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content Grid */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {activeTab === "posts" &&
          (profile?.posts?.length > 0 ? (
            profile.posts.map((post, index) => (
              <img
                key={index}
                src={post.image || "https://via.placeholder.com/200"}
                alt="User Post"
                className="w-full h-40 object-cover rounded-lg"
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">No posts yet</p>
          ))}

        {activeTab === "saved" &&
          (profile?.saved?.length > 0 ? (
            profile.saved.map((post, index) => (
              <img
                key={index}
                src={post.image || "https://via.placeholder.com/200"}
                alt="Saved Post"
                className="w-full h-40 object-cover rounded-lg"
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">No saved posts</p>
          ))}

        {activeTab === "tagged" && (
          <p className="text-center text-gray-500 col-span-3">No tagged posts yet</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
