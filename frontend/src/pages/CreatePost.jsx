import React, { useEffect, useState } from 'react';
import { FiImage } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useCreatePostMutation } from '../redux/apis/postApi';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { user } = useSelector((store) => store.auth);
  const [createPost, { isLoading, isSuccess, isError, error }] = useCreatePostMutation();
  const navigate=useNavigate()
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption || !image) {
      alert("Please add a caption and select an image.");
      return;
    }
    
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);
    
    try {
      await createPost(formData).unwrap();
     
    } catch (err) {
      console.error("Failed to create post", err);
      alert("Failed to create post. Please try again.");
    }
  };

  useEffect(()=>{
   if(isSuccess){
    setCaption('');
    setImage(null);
    setPreview(null);
    alert("Post created successfully!");
    navigate("/dashboard")
   }
  },[isSuccess])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Create Post</h2>
        
        {/* User Profile */}
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg shadow-sm">
          <img src={user?.profilePicture} alt="User" className="w-14 h-14 rounded-full border-2 border-blue-500" />
          <div>
            <p className="font-semibold text-gray-800 text-lg capitalize">{user?.username}</p>
            <p className="text-gray-500 text-sm capitalize">{user?.bio}</p>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Caption Input */}
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows="3"
            required
          ></textarea>
          
          {/* Image Upload */}
          <label className="flex items-center space-x-2 cursor-pointer bg-gray-200 p-3 rounded-lg hover:bg-gray-300 transition-all">
            <FiImage className="text-blue-500 text-xl" />
            <span className="text-gray-700">Select Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              required
            />
          </label>
          
          {/* Image Preview */}
          {preview && <img src={preview} alt="Preview" className="w-full h-48 object-fit mt-3 rounded-lg shadow-md" />}
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;