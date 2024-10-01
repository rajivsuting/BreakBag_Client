import { Button, Input, Textarea } from "@material-tailwind/react";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import usePreventScrollOnNumberInput from "../CustomHook/usePreventScrollOnNumberInput";
import { toast } from "react-toastify";
import { serverUrl } from "../api";

const AddTravelSummery = ({ isOpen, onClose,getAlldata }) => {
  // Prevent scrolling on number inputs (custom hook)
  usePreventScrollOnNumberInput();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
console.log(formData);

    try {
      // Make the API call to submit the form data
      const response = await axios.post(`${serverUrl}/api/travel-summary/travel-summary`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

    //   console.log("Response:", response.data);

      alert("Travel summery submited")
      getAlldata()
      // Clear the form
      setFormData({
        title: "",
        description: "",
      });

      

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-2/5 min-w-[50%] max-w-[50%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center justify-end font-sans text-2xl font-semibold text-blue-gray-900">
          <AiOutlineClose className="cursor-pointer" size={24} onClick={onClose} />
        </div>
        <div className="">
          <form className="m-auto" onSubmit={handleSubmit}>
            <div className="m-auto mb-5">
              <div className="font-normal text-xl">Add Travel Summery</div>
            </div>
            <div className="flex justify-between items-center m-auto gap-10 mt-5">
              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="m-auto mt-5">
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-[90%] flex justify-center items-center text-center mt-5 m-auto">
              <Button
                className="bg-main"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Summary"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTravelSummery;
