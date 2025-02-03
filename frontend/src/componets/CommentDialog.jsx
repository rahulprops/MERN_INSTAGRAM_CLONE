import React, { useState } from "react";
import image from "../assets/kurta.jpg";

const CommentDialog = ({ open, setOpen, post, onSubmitComment }) => {
  const [text, setText] = useState("");
//  console.log(post)
  if (!open) return null; // Do not render the dialog if not open

  const handleClose = () => {
    setOpen(false);
  };

  const handleCommentSubmit = () => {
    if (text.trim()) {
      onSubmitComment(text.trim()); // Pass comment to parent component
      setText(""); // Clear input after submit
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Comments</h2>
          <button onClick={handleClose} className="text-xl">X</button>
        </div>

        {/* Main Content: Image and Comment Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left: Image */}
          <div className="relative">
            <img src={post?.image} alt="Post" className="w-full h-full object-cover rounded-lg" />
          </div>

          {/* Right: Comments Section */}
            <div className=" flex border-b-1 border-amber-100 h-16 ">
              <div><img src={post?.author?.profilePicture} alt="" className=" h-14 w-14 rounded-full" /></div>
              <div className=" flex ps-2 capitalize ">{post.author.username}</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
