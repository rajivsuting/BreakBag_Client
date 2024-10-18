import { Button, Input, Textarea } from "@material-tailwind/react";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import usePreventScrollOnNumberInput from "../CustomHook/usePreventScrollOnNumberInput";
import { serverUrl } from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddDestination = ({ isOpen, onClose, getAlldata }) => {
  usePreventScrollOnNumberInput();

  // State to manage form inputs
  const [formData, setFormData] = useState({
    title: "",
    image: "",
  });
  const [file, setFile] = useState(null); // state to handle a single file
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Handle form input changes
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input change (for a single file)
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // store a single file
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    setIsLoading(true);

    const data = new FormData();

    // Append form data (title and description)
    data.append("title", formData.title);

    // Append the single file
    if (file) {
      data.append("image", file); // Ensure you use the correct key, which is `image`
    }

    try {
      // API call to submit form data
      const response = await axios.post(
        `${serverUrl}/api/destination/create`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      toast.success("Destination added successfully");
      getAlldata();

      // Reset form after successful submission
      setFormData({ title: "", image: "" });
      setFile(null);
      onClose(); // Close modal on success
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data.message || "Something went wrong";
  
        // Show custom error messages based on status codes
        switch (status) {
          case 400:
            toast.error(`Bad Request: ${errorMessage}`);
            break;
          case 401:
            toast.error("Unauthorized: Please log in again.");
            break;
          case 403:
            toast.error("Forbidden: You do not have permission to perform this action.");
            break;
          case 404:
            toast.error("Not Found: The requested resource could not be found.");
            break;
          case 500:
            toast.error("Server Error: Please try again later.");
            break;
          default:
            toast.error(`Error: ${errorMessage}`);
        }
      } else if (error.request) {
        // Network error (no response received)
        toast.error("Network Error: No response received from the server.");
      } else {
        // Something else happened
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="sidebar relative m-4 w-2/5 min-w-[40%] max-w-[40%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center justify-end font-sans text-2xl font-semibold text-blue-gray-900">
          <AiOutlineClose
            className="cursor-pointer text-sm text-red-500 hover:bg-main hover:text-white rounded-[50%] p-1"
            size={24}
            onClick={onClose}
          />
        </div>
        <div>
          <form onSubmit={handleSubmit} className="m-auto">
            <div className="m-auto mb-5">
              <div className="font-normal text-xl">Add Destination</div>
            </div>
            <div className="flex justify-between items-center m-auto gap-10 mt-5">
              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChangeInput}
                required
              />
            </div>
            <div className="flex justify-between items-center m-auto gap-10 mt-5">
              <Input
                label="Upload first page"
                name="file"
                type="file"
                onChange={handleFileChange}
                required
              />
            </div>

            <div className="w-[90%] flex justify-center items-center text-center mt-5 m-auto">
              <Button className="bg-main" type="submit" disabled={isLoading}>
                {isLoading ? "Adding destination..." : "Add destination"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDestination;
