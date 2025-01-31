import React, { useState } from "react";
import { FiHeart, FiMessageCircle, FiSend, FiMoreHorizontal, FiBookmark } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import image from '../assets/kurta.jpg';
import CommentDialog from "../componets/CommentDialog";

const Posts = () => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(120);
  const [saved, setSaved] = useState(false);
  const [text, setText] = useState(""); // State for comment text
  const [open, setOpen] = useState(false); // State to manage comment dialog visibility
  const [comments, setComments] = useState(["Beautiful!", "Amazing view!", "Love it!"]); // Example comments

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const toggleSave = () => {
    setSaved(!saved);
  };

  const handleCommentChange = (e) => {
    setText(e.target.value);
  };

  const handleCommentSubmit = () => {
    const trimmedText = text.trim(); // Trim the whitespace from the input

    if (trimmedText) {
      setComments([...comments, trimmedText]); // Add new comment to the list
      setText(""); // Clear input after submitting
    } else {
      console.log("Comment cannot be empty");
    }
  };

  return (
    <div className="max-w-lg bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={image} alt="User" className="w-10 h-10 rounded-full" />
          <span className="font-semibold">username</span>
        </div>
        <FiMoreHorizontal className="text-xl cursor-pointer" />
      </div>

      {/* Post Image */}
      <div className="mt-3">
        <img src={image} alt="Post" className="rounded-lg w-full" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex space-x-4">
          {liked ? (
            <FaHeart className="text-red-500 text-2xl cursor-pointer" onClick={toggleLike} />
          ) : (
            <FiHeart className="text-2xl cursor-pointer" onClick={toggleLike} />
          )}
          <FiMessageCircle onClick={() => setOpen(true)} className="text-2xl cursor-pointer" />
          <FiSend className="text-2xl cursor-pointer" />
        </div>

        {/* Save Button */}
        <FiBookmark
          className={`text-2xl cursor-pointer ${saved ? "text-blue-500" : ""}`}
          onClick={toggleSave}
        />
      </div>

      {/* Likes Count */}
      <p className="font-semibold mt-2">{likes} likes</p>

      {/* Caption */}
      <p className="text-sm mt-1">
        <span className="font-semibold">username</span> Loving this beautiful view! 🌄✨
      </p>

      {/* Comments */}
      <p className="text-sm text-gray-500 mt-2 cursor-pointer" onClick={() => setOpen(true)}>
        View all {comments.length} comments
      </p>
      
      {/* Comment Dialog */}
      <CommentDialog open={open} setOpen={setOpen} comments={comments} setComments={setComments} />

      {/* Add Comment Input */}
      <div className="mt-3 flex items-center">
        <input
          type="text"
          value={text}
          onChange={handleCommentChange}
          placeholder="Add a comment..."
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        
        {/* Submit Button - Displayed when there's text */}
        {text.trim() && (
          <button
            onClick={handleCommentSubmit}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Post
          </button>
        )}
      </div>
    </div>
  );
};

export default Posts;
