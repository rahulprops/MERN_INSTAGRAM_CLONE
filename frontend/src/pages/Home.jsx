import React from "react";
import Feed from "./Feed";
import RightSidebar from "../componets/RightSidebar";


const Home = () => {
  return (
    <div className="flex justify-center gap-6 p-4">
      {/* Feed Section */}
      <div className="w-full max-w-2xl">
        <Feed />
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block w-80">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
