import { Button, Input, Textarea } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { serverUrl } from "../api";
import Select from "react-select";
import { useParams, useSearchParams } from "react-router-dom";

const Addcomment = ({ isOpen, onClose, getAlldata }) => {
  const [searchparam] = useSearchParams();
//   console.log(searchparam.get("quote"))
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");
console.log(localStorage.getItem("token"))
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(
      `${serverUrl}/api/quote/${searchparam.get("quote")}/comments`,
      {
        comment,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then((res)=>{
        alert("Comments added");
        getAlldata();
        onClose()
    });
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="sidebar relative m-4 w-2/5 max-w-[90%] max-h-[90vh] overflow-y-auto rounded-lg bg-white text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center justify-end font-sans text-2xl font-semibold text-blue-gray-900">
          <AiOutlineClose
            className="cursor-pointer text-sm text-red-500 hover:bg-main hover:text-white rounded-[50%] p-1"
            size={24}
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-xl font-normal">Add Comment</div>

          <Textarea
            label={`Comment`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[50px] h-auto" // Adjusted height
            required
          />

          <div className="flex justify-center">
            <Button className="bg-main" type="submit" disabled={isLoading}>
              {isLoading ? "Adding Comment..." : "Add Comment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addcomment;
