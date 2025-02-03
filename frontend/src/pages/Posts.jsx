import React, { useEffect, useState } from "react";
import { FiHeart, FiMessageCircle, FiSend, FiMoreHorizontal, FiBookmark } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import CommentDialog from "../componets/CommentDialog";
import { useAddCommentsMutation, useLikeOrDislikeMutation } from "../redux/apis/postApi";
import { useSelector } from "react-redux";

const Posts = ({ post }) => {
  const { user } = useSelector((store) => store.auth);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [likes, setLikes] = useState(post.likes.length);
  const [saved, setSaved] = useState(false);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const [likeOrDislike] = useLikeOrDislikeMutation();
  const [addComments, { isSuccess, isError, error, isLoading }] = useAddCommentsMutation();
//  console.log(liked)
  // Handle Like/Dislike
  const likeOrDisLikesHandler = async () => {
    try {
      const action = liked ? "dislike" : "likes";
      await likeOrDislike({ action, postId: post?._id });

      // Update UI after success
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Comment Submission
  const handleCommentSubmit = async () => {
    const trimmedText = text.trim();
    if (trimmedText) {
      try {
        await addComments({ postId: post?._id, text: trimmedText });
        setText("");
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Comment cannot be empty");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      alert("Comment added successfully");
      setText("");
    }
    if (isError) {
      alert(error?.message);
    }
  }, [isSuccess, isError, error]);

  return (
    <div className="max-w-lg bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={post?.author?.profilePicture} alt="User" className="w-10 h-10 rounded-full" />
          <span className="font-semibold capitalize">{post.author.username}</span>
        </div>
        <FiMoreHorizontal className="text-xl cursor-pointer" />
      </div>

      {/* Post Image */}
      <div className="mt-3">
        <img src={post?.image} alt="Post" className="rounded-lg w-full" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex space-x-4">
          {liked ? (
            <FaHeart className="text-red-500 text-2xl cursor-pointer" onClick={likeOrDisLikesHandler} />
          ) : (
            <FiHeart className="text-2xl cursor-pointer" onClick={likeOrDisLikesHandler} />
          )}
          <FiMessageCircle onClick={() => setOpen(true)} className="text-2xl cursor-pointer" />
          <FiSend className="text-2xl cursor-pointer" />
        </div>

        {/* Save Button */}
        <FiBookmark
          className={`text-2xl cursor-pointer ${saved ? "text-blue-500" : ""}`}
          onClick={() => setSaved(!saved)}
        />
      </div>

      {/* Likes Count */}
      <p className="font-semibold mt-2">{likes} likes</p>

      {/* Caption */}
      <p className="text-sm mt-1">
        <span className="font-semibold capitalize">{post.author.username}</span> {post.caption} 🌄✨
      </p>

      {/* Comments */}
      <p className="text-sm text-gray-500 mt-2 cursor-pointer" onClick={() => setOpen(true)}>
        View all {post.comments.length} comments
      </p>

      {/* Comment Dialog */}
      <CommentDialog open={open} setOpen={setOpen} comments={post.comments} onSubmitComment={handleCommentSubmit} />

      {/* Add Comment Input */}
      <div className="mt-3 flex items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border border-gray-300 rounded-lg"
        />

        {text.trim() && (
          <button onClick={handleCommentSubmit} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
            Post
          </button>
        )}
      </div>
    </div>
  );
};

export default Posts;
