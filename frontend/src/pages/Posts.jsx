import React, { useState } from "react";
import { FiHeart, FiMessageCircle, FiSend, FiMoreHorizontal } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const Posts = () => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(120); // Default likes

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <div className="max-w-lg bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold">username</span>
        </div>
        <FiMoreHorizontal className="text-xl cursor-pointer" />
      </div>

      {/* Post Image */}
      <div className="mt-3">
        <img
          src="https://via.placeholder.com/500"
          alt="Post"
          className="rounded-lg w-full"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex space-x-4">
          {liked ? (
            <FaHeart className="text-red-500 text-2xl cursor-pointer" onClick={toggleLike} />
          ) : (
            <FiHeart className="text-2xl cursor-pointer" onClick={toggleLike} />
          )}
          <FiMessageCircle className="text-2xl cursor-pointer" />
          <FiSend className="text-2xl cursor-pointer" />
        </div>
      </div>

      {/* Likes Count */}
      <p className="font-semibold mt-2">{likes} likes</p>

      {/* Caption */}
      <p className="text-sm mt-1">
        <span className="font-semibold">username</span> Loving this beautiful view! 🌄✨
      </p>

      {/* Comments */}
      <p className="text-sm text-gray-500 mt-2 cursor-pointer">View all 20 comments</p>
    </div>
  );
};

export default Posts;
