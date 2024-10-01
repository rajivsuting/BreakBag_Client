import {
    Button,
    Input,
    Textarea,
  } from "@material-tailwind/react";
  import React, { useState } from "react";
  import { AiOutlineClose } from "react-icons/ai";
  import axios from "axios";
  import usePreventScrollOnNumberInput from "../CustomHook/usePreventScrollOnNumberInput";
  import { serverUrl } from "../api";
  
  const AddActivities = ({ isOpen, onClose,getAlldata }) => {
    usePreventScrollOnNumberInput();
  
    // State to manage form inputs
    const [formData, setFormData] = useState({
      title: "",
      description: "",
    });
    const [files, setFiles] = useState([]); // state to handle multiple files
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
  
    // Handle file input changes (for multiple files)
    const handleFileChange = (e) => {
      setFiles(e.target.files); // store multiple files
    };
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent the form from refreshing the page
      setIsLoading(true);
  
      const data = new FormData();
  
      // Append form data (title and description)
      data.append("title", formData.title);
      data.append("description", formData.description);
  
      // Append multiple files
      if (files.length > 0) {
        Array.from(files).forEach((file) => {
          data.append("images", file); // Ensure you use the correct key, which is `images`
        });
      }

      try {
        // API call to submit form data
        const response = await axios.post(`${serverUrl}/api/activity/create`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Response:", response.data);
  alert("Activity added successfully")
  getAlldata()
        // Reset form after successful submission
        setFormData({ title: "", description: "" });
        setFiles([]);
        onClose(); // Close modal on success
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
        <div className="relative m-4 w-2/5 min-w-[50%] max-w-[50%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-8">
          <div className="flex items-center justify-end font-sans text-2xl font-semibold text-blue-gray-900">
            <AiOutlineClose className="cursor-pointer" size={24} onClick={onClose} />
          </div>
          <div>
            <form onSubmit={handleSubmit} className="m-auto">
              <div className="m-auto mb-5">
                <div className="font-normal text-xl">Add Activities</div>
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
                  label="Upload Files"
                  name="file"
                  type="file"
                  multiple // allow multiple files
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="m-auto mt-5">
                <Textarea
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChangeInput}
                  required
                />
              </div>
              <div className="w-[90%] flex justify-center items-center text-center mt-5 m-auto">
                <Button
                  className="bg-main"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding Activity..." : "Add Activity"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default AddActivities;
  