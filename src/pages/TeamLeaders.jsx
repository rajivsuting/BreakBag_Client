import React from "react";
import Sidebar from "../components/Sidebar";



const TeamLeaders = () => {

  return (
    <div className="flex gap-5 ">
      <Sidebar />
      <div className="w-[75%] m-auto mt-12 rounded-md">
        <div className="flex justify-between items-center">
          <div className="text-2xl">TeamLeaders</div>
        </div>
        </div>
    </div>
  );
};

export default TeamLeaders;
