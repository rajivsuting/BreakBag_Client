import { Button, Textarea } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { serverUrl } from "../api";
import Select from "react-select";

const AddOtherInformation = ({ isOpen, onClose, getAlldata }) => {
  // State to manage form inputs
  const [descriptions, setDescriptions] = useState([""]); // Array of descriptions
  const [isLoading, setIsLoading] = useState(false);
  const [destinationAll, setDestinationAll] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");

  useEffect(() => {
    axios.get(`${serverUrl}/api/destination/destinaions`).then((res) => {
      setDestinationAll(res.data.data);
    });

    return () => {
      console.log("");
    };
  }, []);

  if (!isOpen) return null;

  // Handle form input changes for dynamic descriptions
  const handleDescriptionChange = (index, e) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = e.target.value;
    setDescriptions(updatedDescriptions);
  };

  // Add new description field
  const addDescription = () => {
    setDescriptions([...descriptions, ""]);
  };

  // Remove description field
  const removeDescription = (index) => {
    const updatedDescriptions = descriptions.filter((_, i) => i !== index);
    setDescriptions(updatedDescriptions);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    setIsLoading(true);

    const data = {
      description: descriptions,
      destination: selectedDestination,
    };

    try {
      // API call to submit form data
      const response = await axios.post(
        `${serverUrl}/api/other-information/other-information/create`,
        data
      );
      console.log("Response:", response.data);
      alert("Other information added successfully");
      getAlldata();

      // Reset form after successful submission
      setDescriptions([""]);
      setSelectedDestination("");
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const options = destinationAll.map((destination) => ({
    value: destination._id,
    label: destination.title,
  }));

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

          <div className="w-[100%]">
            {/* react-select component */}
            <Select
              options={options} // The options fetched from API
              value={options.find(
                (option) => option.value === selectedDestination
              )} // Pre-select the value if needed
              onChange={(selectedOption) =>
                setSelectedDestination(selectedOption?.value || "")
              }
              placeholder="Select a destination"
              isSearchable={true}
              isClearable={true} // Allows clearing the selection
              required
            />
          </div>

          {/* Dynamic input fields for Description */}
          {descriptions.map((description, index) => (
            <div key={index} className="flex gap-5">
              <div className="w-full">
                <Textarea
                  label={`Description ${index + 1}`}
                  value={description}
                  onChange={(e) => handleDescriptionChange(index, e)}
                  className="min-h-[50px] h-auto" // Adjusted height
                  required
                />
              </div>
              {index === 0 ? (
                <AiOutlinePlus
                 className="cursor-pointer text-sm text-green-500 hover:bg-green-500 hover:text-white rounded-[50%] p-1"
                  size={22}
                  onClick={addDescription}
                />
              ) : (
                <AiOutlineClose
                  className="cursor-pointer text-sm text-red-500 hover:bg-main hover:text-white rounded-[50%] p-1"
                  size={20}
                  onClick={() => removeDescription(index)}
                />
              )}
            </div>
          ))}

          {/* Submit button */}
          <div className="flex justify-center">
            <Button className="bg-main" type="submit" disabled={isLoading}>
              {isLoading ? "Adding Other Information..." : "Add Other Information"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOtherInformation;
