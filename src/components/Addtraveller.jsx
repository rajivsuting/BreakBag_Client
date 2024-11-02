import {
  Button,
  Input,
  Option,
  Select as MaterialSelect,
  Textarea,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import usePreventScrollOnNumberInput from "../CustomHook/usePreventScrollOnNumberInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { serverUrl } from "../api";
import Select from "react-select";

const Addtraveller = ({ isOpen, onClose, getAlldata }) => {
  // Prevent scrolling on number inputs (custom hook)
  usePreventScrollOnNumberInput();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    // dateOfBirth: "",
    userType: "",
    agentAssigned: "",
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [agentAll, setAgentAll] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(""); // null initially

  const getAllData = () => {
    axios.get(`${serverUrl}/api/agent/all/?role=Agent`).then((res) => {
      setAgentAll(res.data.data);
    });
  };
  const options = agentAll.map((agent) => ({
    value: agent._id,
    label: agent.name,
  }));
  console.log(options);
  useEffect(() => {
    getAllData();
    return () => {
      console.log("Avoid errors");
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      userType: value,
    }));
  };

  const handleAgentChange = (option) => {
    const agentValue = option ? option.value : null;
    setSelectedAgent(agentValue);
  
    // Directly update formData when agent is selected
    setFormData((prevState) => ({
      ...prevState,
      agentAssigned: agentValue,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
console.log(formData);

    try {
      // Make the API call to submit the form data
      const response = await axios.post(
        `${serverUrl}/api/traveller/create`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      //   console.log("Response:", response.data);

      toast.success("Traveller summery submited");
      getAlldata();
      // Clear the form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        // dateOfBirth: "",
        userType: "",
      });

      setSelectedAgent("")

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
      <div className="sidebar relative m-4 w-2/5 min-w-[50%] max-w-[50%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-8">
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
              <div className="font-normal text-xl">Add Traveller</div>
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
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {/* <Input
                label="Date of birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              /> */}
            </div>

            <div className="flex justify-between items-center m-auto gap-10 mt-5">
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <MaterialSelect
                label="User type"
                name="userType"
                value={formData.userType}
                onChange={(value) => handleSelectChange(value)}
                required
              >
                <Option>Select user type</Option>
                <Option value="Adult">Adult</Option>
                <Option value="Child">Child</Option>
              </MaterialSelect>
              <div className="w-[100%]">
              <Select
  options={options}
  value={options.find((option) => option.value === selectedAgent)}
  onChange={handleAgentChange} // Use the updated handler
  placeholder="Select an agent"
  isSearchable={true}
  isClearable={true}
/>
              </div>
            </div>
            <div className="m-auto mt-5">
              <Textarea
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-[90%] flex justify-center items-center text-center mt-5 m-auto">
              <Button className="bg-main" type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Traveller"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addtraveller;
