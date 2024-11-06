import {
    Button,
    Input,
    Option,
    Select,
    Textarea,
  } from "@material-tailwind/react";
  import React, { useEffect, useState } from "react";
  import { AiOutlineClose } from "react-icons/ai";
  import axios from "axios";
  import usePreventScrollOnNumberInput from "../CustomHook/usePreventScrollOnNumberInput";
  import { toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { serverUrl } from "../api";
  
  const EditAgent = ({ isOpen, onClose, getAllData,singleAgent }) => {
    // Prevent scrolling on number inputs (custom hook)
    usePreventScrollOnNumberInput();
  
    // Form state
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      role: "",
    });

    useEffect(() => {
        if (singleAgent) {
            setFormData(singleAgent);
        }
      }, [singleAgent]);
  
    // Loading state
    const [isLoading, setIsLoading] = useState(false);
  
    // Handle form input changes (for Input fields)
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    // Handle Select change for Role
    const handleRoleChange = (value) => {
      setFormData((prevState) => ({
        ...prevState,
        role: value, // Update the role field in formData
      }));
    };
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        // Make the API call to submit the form data
        const response = await axios.put(
          `${serverUrl}/api/agent/edit/${singleAgent._id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
    
        // Show success toast
        toast.success("Agent added successfully!");
        getAllData();
    
        // Clear the form
        setFormData({
          name: "",
          email: "",
          phone: "",
          role: "",
        });
    
        // Close the modal
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
    
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
        <div className="sidebar relative m-4 w-3/5 min-w-[50%] max-w-[50%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-8">
          <div className="flex items-center justify-end font-sans text-2xl font-semibold text-blue-gray-900">
            <AiOutlineClose
              className="cursor-pointer text-sm text-red-500 hover:bg-main hover:text-white rounded-[50%] p-1"
              size={24}
              onClick={onClose}
            />
          </div>
          <div className="">
            <form className="m-auto" onSubmit={handleSubmit}>
              <div className="m-auto mb-5">
                <div className="font-normal text-xl">Edit Agent</div>
              </div>
              <div className="flex justify-between items-center m-auto gap-10 mt-5">
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex justify-between items-center m-auto gap-10 mt-5">
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <Select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleRoleChange} // Update the role field
                  required
                >
                  <Option disabled>Select role</Option>
                  <Option value="Agent">Agent</Option>
                  <Option value="Team Lead">Team Lead</Option>
                </Select>
              </div>
              <div className="w-[90%] flex justify-center items-center text-center mt-5 m-auto">
                <Button className="bg-main" type="submit" disabled={isLoading}>
                  {isLoading ? "Editing agent..." : "Edit Agent"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default EditAgent;
  