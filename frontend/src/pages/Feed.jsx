import React from 'react';
import Posts from './Posts';
import { useListPostQuery } from '../redux/apis/postApi';

const Feed = () => {
  const { data, isLoading, isSuccess, isError, error } = useListPostQuery();

  if (isLoading) return <p className="text-center">Loading posts...</p>;
  if (isError) return <p className="text-center text-red-500">Error: {error?.message}</p>;

  return (
    <div className="space-y-4">
      {isSuccess && data.length > 0 ? (
        data.map((post) => <Posts key={post._id} post={post} />)
      ) : (
        <p className="text-center text-gray-500">No posts available.</p>
      )}
    </div>
  );
};

export default Feed;
