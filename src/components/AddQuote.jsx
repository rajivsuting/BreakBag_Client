import { Button, Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { serverUrl } from "../api";
import Sidebar from "./Sidebar";
import Select from "react-select";

const AddQuote = () => {
  const [data, setData] = useState([]); // List of travelers
  const [selectedTravellers, setSelectedTravellers] = useState([]); // Selected travelers
  const [isLoading, setIsLoading] = useState(false);
  const [destinationAll, setDestinationAll] = useState([]);
  const [formState, setFormState] = useState({
    destination: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    axios.get(`${serverUrl}/api/traveller/all`).then((res) => {
      setData(res.data.travellers);
    });
    axios.get(`${serverUrl}/api/destination/destinaions`).then((res) => {
      setDestinationAll(res.data.data);
    });
  }, []);

  // Function to handle traveler selection
  const handleTravelerSelection = (travellerId, travellerName) => {
    setSelectedTravellers((prevSelected) => {
      if (prevSelected.some((t) => t.id === travellerId)) {
        return prevSelected.filter((t) => t.id !== travellerId);
      } else {
        return [...prevSelected, { id: travellerId, name: travellerName }];
      }
    });
  };

  // Function to handle input changes for other fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  // Function to handle destination selection in react-select
  const handleSelectChange = (selectedOption) => {
    setFormState({ ...formState, destination: selectedOption ? selectedOption.value : "" });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      destination: formState.destination,
      startDate: formState.startDate,
      endDate: formState.endDate,
      travellers: selectedTravellers.map((t) => t.id),
    };

    axios
      .post(`${serverUrl}/api/quote/quotes`, formData)
      .then((res) => {
        setIsLoading(false);
        alert("Quote added successfully")
      })
      .catch((error) => {
        console.error("Error adding quote:", error);
        setIsLoading(false);
      });
  };

  const options = destinationAll.map((destination) => ({
    value: destination._id,
    label: destination.title,
  }));

  return (
    <div className="flex gap-5">
      <Sidebar />
      <div className="w-[75%] m-auto mt-8 rounded-md">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <img
              src="/img/lanscape1.jpg"
              className="w-full h-[200px] mb-5 rounded-md"
              alt=""
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="text-2xl">Quote</div>
          </div>
          <div className="flex justify-between m-auto gap-10 mt-5">
            {/* Left side: Form fields and selected travelers */}
            <div className="w-[70%]">
              <div className="flex justify-between items-center m-auto gap-10 mt-5">
                <div className="w-[100%]">
                  {/* react-select component */}
                  <Select
                    options={options} // The options fetched from API
                    value={options.find((option) => option.value === formState.destination)} // Pre-select the value if needed
                    onChange={handleSelectChange} // Handle selection
                    placeholder="Select a destination"
                    isSearchable={true}
                    isClearable={true} // Allows clearing the selection
                  />
                </div>
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
                      onChange={() => handleTravelerSelection(el._id, el.name)}
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
