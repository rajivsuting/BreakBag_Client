import { Button, Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { serverUrl } from "../api";
import Sidebar from "./Sidebar";
import Select from "react-select";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddQuote = () => {
  const [data, setData] = useState([]); // List of travelers
  const [filteredData, setFilteredData] = useState([]); // Filtered traveler list
  const [selectedTravellers, setSelectedTravellers] = useState([]); // Selected traveler
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const navigate = useNavigate();
  const [destinationAll, setDestinationAll] = useState([]);
  const [formState, setFormState] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    numberChildTravellers: "",
    numberOfTravellers: 0,
    numberOfAdultTravellers: "",
  });

  useEffect(() => {
    axios
      .get(`${serverUrl}/api/traveller/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setData(res.data.travellers);
        setFilteredData(res.data.travellers); // Initialize filtered data
      });
    axios.get(`${serverUrl}/api/destination/destinaions`).then((res) => {
      setDestinationAll(res.data.data);
    });
  }, []);

  const handleTravelerSelection = (travellerId, travellerName) => {
    if (selectedTravellers.some((t) => t.id === travellerId)) {
      setSelectedTravellers([]); // Deselect the traveller
    } else {
      setSelectedTravellers([{ id: travellerId, name: travellerName }]); // Select only one traveller
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSelectChange = (selectedOption) => {
    setFormState({
      ...formState,
      destination: selectedOption ? selectedOption.value : "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      destination: formState.destination,
      startDate: formState.startDate,
      endDate: formState.endDate,
      travellers: selectedTravellers.map((t) => t.id),
      numberOfTravellers:
        Number(formState.numberChildTravellers) +
        Number(formState.numberOfAdultTravellers),
      numberChildTravellers: formState.numberChildTravellers,
      numberOfAdultTravellers: formState.numberOfAdultTravellers,
    };

    axios
      .post(`${serverUrl}/api/quote/quotes`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        toast.success("Quote added successfully");
        navigate("/quote");
      })
      .catch((error) => {
        setIsLoading(false);
        const errorMessage =
          error.response?.data?.message || "Something went wrong";
        toast.error(`Error: ${errorMessage}`);
      });
  };

  const handleSearch = () => {
    const filtered = data.filter((traveller) =>
      traveller.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setFilteredData(data); // Reset to full list
  };

  const options = destinationAll.map((destination) => ({
    value: destination._id,
    label: destination.title,
  }));

  return (
    <div className="flex gap-5">
      <div className="w-[100%] m-auto mt-3 rounded-md p-4">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative w-full">
            <div
              className="inset-0 bg-cover bg-center rounded-md relative"
              style={{
                backgroundImage: 'url("/img/lanscape2.jpg")',
                height: "200px",
              }}
            >
              <div className="absolute inset-0 bg-black opacity-50 rounded-md pointer-events-none"></div>
              <div className="absolute inset-0 flex flex-col p-4 pb-0 justify-between z-10">
                <div className="text-3xl text-white font-semibold">
                  Add quote
                </div>
              </div>
            </div>
          </div>
          <div
            className="w-[70px] border-b cursor-pointer hover:border-b-blue text-maincolor2 "
            onClick={() => window.history.back()}
          >
            Go back
          </div>
          <div className="flex justify-between m-auto gap-10">
            <div className="w-[70%]">
              <div className="flex justify-between items-center m-auto gap-10">
                <div className="w-[50%]">
                  <Select
                    options={options}
                    value={options.find(
                      (option) => option.value === formState.destination
                    )}
                    onChange={handleSelectChange}
                    placeholder="Select a destination"
                    isSearchable={true}
                    isClearable={true}
                  />
                </div>
                <div className="w-[50%]">
                  <Input
                    label="No. of adult travellers"
                    type="number"
                    name="numberOfAdultTravellers"
                    value={formState.numberOfAdultTravellers}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="w-[50%]">
                  <Input
                    label="No. of child travellers"
                    name="numberChildTravellers"
                    type="number"
                    value={formState.numberChildTravellers}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between items-center m-auto gap-10 mt-5">
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
              <div className="text-start w-[50%] mt-5 mb-5 flex justify-start item-center  gap-1">
                <strong>Selected traveller:</strong>
                {selectedTravellers.length > 0 && (
                  <ul>
                    {selectedTravellers.map((traveller) => (
                      <li key={traveller.id}>{traveller.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="border border-2 border-gray"></div>
            <div className="w-[30%] overflow-y-auto">
              <div className="text-start mt-5 mb-5 flex items-center">
                <strong>Traveller list:</strong>
              </div>
              <div className="flex items-center mb-3 relative">
                <Input
                  label="Search Travellers"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10" // Add padding-right to avoid overlapping the icon
                />
                {searchQuery && (
                  <AiOutlineClose
                    className="absolute right-32 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={handleResetSearch}
                  />
                )}
                <Button onClick={handleSearch} className="ml-3">
                  Search
                </Button>
              </div>
              <div className="h-[280px] overflow-y-scroll sidebar">
                {filteredData.map((el) => (
                  <div
                    className="flex justify-start items-center m-auto gap-5 mt-5"
                    key={el._id}
                  >
                    <input
                      type="radio" // Changed to radio for single selection
                      value={el._id}
                      checked={selectedTravellers.some((t) => t.id === el._id)}
                      onChange={() => handleTravelerSelection(el._id, el.name)}
                    />
                    <div>{el.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
