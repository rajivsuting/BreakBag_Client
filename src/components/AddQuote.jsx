import {
    Button,
    Input,
    Option,
    Select,
    Textarea,
  } from "@material-tailwind/react";
  import React, { useEffect, useState } from "react";
  import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
  import axios from "axios";
  import { serverUrl } from "../api";
  
  const AddQuote = ({ isOpen, onClose, getAlldata }) => {
    // State to manage form inputs
    const [data, setData] = useState([]); // List of travelers
    const [selectedTravellers, setSelectedTravellers] = useState([]); // Selected travelers
    const [isLoading, setIsLoading] = useState(false);
    const [formState, setFormState] = useState({
      destination: "",
      startDate: "",
      endDate: "",
    });
  
    useEffect(() => {
      axios.get(`${serverUrl}/api/traveller/all`).then((res) => {
        setData(res.data.travellers);
      });
    }, []);
  
    // Function to handle traveler selection
    const handleTravelerSelection = (travellerId, travellerName) => {
      setSelectedTravellers((prevSelected) => {
        if (prevSelected.some(t => t.id === travellerId)) {
          // If already selected, remove from the list
          return prevSelected.filter((t) => t.id !== travellerId);
        } else {
          // Add to the list if not already selected
          return [...prevSelected, { id: travellerId, name: travellerName }];
        }
      });
    };
  
    // Function to handle input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormState({ ...formState, [name]: value });
    };
  
    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      setIsLoading(true);
  
      // Form data to be submitted
      const formData = {
        destination: formState.destination,
        startDate: formState.startDate,
        endDate: formState.endDate,
        travellers: selectedTravellers.map((t) => t.id),
      };

      console.log(formData)
  
    //   // Submit the form data
    //   axios
    //     .post(`${serverUrl}/api/quote/add`, formData)
    //     .then(() => {
    //       setIsLoading(false);
    //       getAlldata(); // Refresh data after submission
    //       onClose(); // Close the modal
    //     })
    //     .catch((error) => {
    //       console.error("Error adding quote:", error);
    //       setIsLoading(false);
    //     });
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
        <div className="relative m-4 w-3/5 w-[90%] h-[90%] max-h-[90vh] overflow-y-auto rounded-lg bg-white text-blue-gray-500 shadow-2xl p-8">
          <div className="flex items-center justify-end font-sans text-2xl font-semibold text-blue-gray-900">
            <AiOutlineClose
              className="cursor-pointer"
              size={24}
              onClick={onClose}
            />
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="text-xl font-normal">Add Quote</div>
  
            <div className="flex justify-between m-auto gap-10 mt-5">
              {/* Left side: Form fields and selected travelers */}
              <div className="w-[70%]">
                <div className="flex justify-between items-center m-auto gap-10 mt-5">
                  <Select
                    label="Select destination"
                    name="destination"
                    required
                    value={formState.destination}
                    onChange={(e) => setFormState({ ...formState, destination: e })}
                  >
                    <Option value="">Select one</Option>
                    <Option value="1">Assam</Option>
                    <Option value="2">Arunachal</Option>
                    <Option value="3">Meghalaya</Option>
                  </Select>
                  <Input
                    label="Start date"
                    name="startDate"
                    type="date"
                    value={formState.startDate}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="End date"
                    name="endDate"
                    type="date"
                    value={formState.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
  
                {/* Display selected travellers */}
                <div className="text-start w-[50%] mt-5 mb-5">
                  <strong>Selected travellers:</strong>
                  <ul>
                    {selectedTravellers.map((traveller) => (
                      <li key={traveller.id} className="mt-1">
                        {traveller.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
  
              {/* Separator */}
              <div className="border border-2 border-gray"></div>
  
              {/* Right side: Traveller list */}
              <div className="w-[30%] overflow-y-auto">
                <div className="text-start mt-5 mb-5">
                  <strong>Traveller list:</strong>
                </div>
                {data?.map((el) => {
                  return (
                    <div
                      className="flex justify-start items-center m-auto gap-10 mt-5"
                      key={el._id}
                    >
                      <input
                        type="checkbox"
                        value={el._id}
                        onChange={() =>
                          handleTravelerSelection(el._id, el.name)
                        }
                      />
                      <div>{el.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
  
            {/* Submit button */}
            <div className="flex justify-center">
              <Button className="bg-main" type="submit" disabled={isLoading}>
                {isLoading ? "Adding Quote..." : "Add Quote"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default AddQuote;
  