import { Button, Input, Textarea } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { serverUrl } from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditTransfer = ({ isOpen, onClose, getAlldata,singleTransfer }) => {
  // State to manage form inputs
  const [transferdata, settransferdata] = useState({
    title: "",
    description: "",
  }); // Array of descriptions
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (singleTransfer) {
        settransferdata(singleTransfer);
    }
  }, [singleTransfer]);

  if (!isOpen) return null;

  const { title, description } = transferdata;

  // Handle form input changes for dynamic descriptions
  const handleChange = (e) => {
    const { name, value } = e.target;
    settransferdata({ ...transferdata, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    setIsLoading(true);

    try {
      // API call to submit form data
      const response = await axios.put(
        `${serverUrl}/api/transfer/edit/${singleTransfer._id}`,
        transferdata
      );
      console.log("Response:", response.data);
      toast.success("Transfer updated successfully");
      getAlldata();
      // Reset form after successful submission
      settransferdata({ title: "", description: "" });
      onClose();
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
      <div className="sidebar relative m-4 w-2/5 max-w-[90%] max-h-[90vh] overflow-y-auto rounded-lg bg-white text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center justify-end font-sans text-2xl font-semibold text-blue-gray-900">
          <AiOutlineClose
            className="cursor-pointer text-sm text-red-500 hover:bg-main hover:text-white rounded-[50%] p-1"
            size={24}
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-xl font-normal">Edit transfer</div>
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
              {isLoading ? "Editing Transfer..." : "Edit Transfer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransfer;
