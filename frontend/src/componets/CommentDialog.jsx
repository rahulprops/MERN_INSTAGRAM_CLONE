import React from 'react';
import image from '../assets/kurta.jpg';

const CommentDialog = ({ open, setOpen, comments, setComments }) => {
  if (!open) return null; // Do not render the dialog if not open

  const handleClose = () => {
    setOpen(false);
  };

  const handleCommentSubmit = (text) => {
    if (text.trim()) {
      setComments([...comments, text.trim()]); // Add comment to the list
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
            <img
              src={image}
              alt="Post"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Right: Comments Section */}
          <div className="flex flex-col w-full">
            {/* Display Comments */}
            <div className="flex flex-col space-y-3 mb-4 max-h-64 overflow-y-auto scroll-smooth">
              {comments.map((comment, index) => (
                <div key={index} className="flex items-start space-x-3">
                  {/* User Image */}
                  <div className="w-8 h-8">
                    <img
                      src={image}
                      alt="User"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {/* Comment Text */}
                  <div className="flex flex-col">
                    <p className="font-semibold">Username</p>
                    <p className="text-sm">{comment}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Comment */}
            <div className="flex items-center space-x-3 mt-3">
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full p-2 border border-gray-300 rounded-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCommentSubmit(e.target.value);
                    e.target.value = ''; // Clear input after submit
                  }
                }}
              />
              <button
                onClick={() => handleCommentSubmit(document.querySelector('input').value)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentDialog;
