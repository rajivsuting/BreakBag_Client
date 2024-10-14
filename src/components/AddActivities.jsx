import { Button, Input, Textarea } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import usePreventScrollOnNumberInput from "../CustomHook/usePreventScrollOnNumberInput";
import { serverUrl } from "../api";
import Select from "react-select";

const AddActivities = ({ isOpen, onClose, getAlldata }) => {
  usePreventScrollOnNumberInput();

  // State to manage form inputs
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    description: [""], // Initially one description
  });
  const [files, setFiles] = useState([]); // state to handle multiple files
  const [isLoading, setIsLoading] = useState(false);
  const [destinationAll, setDestinationAll] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null); // null initially

  const options = destinationAll.map((destination) => ({
    value: destination._id,
    label: destination.title,
  }));

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/destination/destinaions`);
        setDestinationAll(res.data.data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  // Update `formData.destination` when `selectedDestination` changes
  useEffect(() => {
    if (selectedDestination) {
      setFormData((prevState) => ({
        ...prevState,
        destination: selectedDestination.value,
      }));
    }
  }, [selectedDestination]);

  // Handle form input changes for title
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle description changes
  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...formData.description];
    newDescriptions[index] = value;
    setFormData({ ...formData, description: newDescriptions });
  };

  // Add new description field
  const handleAddDescription = () => {
    setFormData((prevState) => ({
      ...prevState,
      description: [...prevState.description, ""],
    }));
  };

  // Remove a description field
  const handleRemoveDescription = (index) => {
    const newDescriptions = formData.description.filter((_, i) => i !== index);
    setFormData({ ...formData, description: newDescriptions });
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

    // Append form data (title, descriptions as an array, and destination)
    data.append("title", formData.title);
    formData.description.forEach((description, i) => {
      data.append(`description[${i}]`, description);
    });
    data.append("destination", formData.destination);

    // Append multiple files
    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        data.append("images", file); // Ensure you use the correct key, which is `images`
      });
    }

    try {
      // API call to submit form data
      const response = await axios.post(
        `${serverUrl}/api/activity/create`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      alert("Activity added successfully");
      getAlldata();
      // Reset form after successful submission
      setFormData({ title: "", destination: "", description: [""] });
      setFiles([]);
      setSelectedDestination(null); // Reset selected destination
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Error submitting form:", error);
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
        <div>
          <form onSubmit={handleSubmit} className="m-auto">
            <div className="m-auto mb-5">
              <div className="font-normal text-xl">Add Activities</div>
            </div>
            <div className="flex justify-between items-center m-auto gap-10 mt-5">
              <div className="w-[100%]">
                <Select
                  options={options}
                  value={selectedDestination}
                  onChange={setSelectedDestination}
                  placeholder="Select a destination"
                  isSearchable={true}
                  isClearable={true}
                  required
                />
              </div>
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
              <div className="font-normal text-lg mb-2">Points</div>
              {formData.description.map((description, index) => (
                <div key={index} className="flex gap-4 mb-4">
                  <Textarea
                    label={`Point ${index + 1}`}
                    name={`description${index}`}
                    className="min-h-[50px] h-auto" // Adjusted height
                    value={description}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                    required
                  />
                  {index > 0 ? (
                    <div>
                      <AiOutlineClose
                        className="cursor-pointer text-sm text-red-500 hover:bg-main hover:text-white rounded-[50%] p-1"
                        size={24}
                        onClick={() => handleRemoveDescription(index)}
                      />
                    </div>
                  ) : (
                    <div>
                      <AiOutlinePlus
                        className="cursor-pointer text-sm text-green-500 hover:bg-main hover:text-white rounded-[50%] p-1"
                        size={24}
                        onClick={handleAddDescription}
                      />
                    </div>
                    // <Button
                    //   className="bg-green-500"
                    //   onClick={handleAddDescription}
                    // >
                    //   Add More Description
                    // </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="w-[90%] flex justify-center items-center text-center mt-5 m-auto">
              <Button className="bg-main" type="submit" disabled={isLoading}>
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
