import { Button, Input, Textarea } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { serverUrl } from "../api";
import Select from "react-select";

const AddOtherInformation = ({ isOpen, onClose, getAlldata }) => {
  // State to manage form inputs
  const [otherInformationdata, setotherInformationdata] = useState({
    title: "",
    description: "",
  }); // Array of descriptions
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const { title, description } = otherInformationdata;

  // Handle form input changes for dynamic descriptions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setotherInformationdata({ ...otherInformationdata, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    setIsLoading(true);

    try {
      // API call to submit form data
      const response = await axios.post(
        `${serverUrl}/api/other-information/other-information/create`,
        otherInformationdata
      );
      alert("Other Information added successfully");
      getAlldata();
      // Reset form after successful submission
      setotherInformationdata({ title: "", description: "" });
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="text-xl font-normal">Add Other Information</div>
          <Input
            label={`Title`}
            value={title}
            name="title"
            onChange={(e) => handleChange(e)}
            // Adjusted height
            required
          />

          <Textarea
            label={`Description`}
            value={description}
            name="description"
            onChange={(e) => handleChange(e)}
            className="min-h-[50px] h-auto" // Adjusted height
            required
          />

          <div className="flex justify-center">
            <Button className="bg-main" type="submit" disabled={isLoading}>
              {isLoading
                ? "Adding Other information..."
                : "Add Other information"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOtherInformation;
