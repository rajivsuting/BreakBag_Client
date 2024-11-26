import { Button, Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { serverUrl } from "../api";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditQuote = ({ isOpen, onClose, singleQuote, getAlldata }) => {
  const [data, setData] = useState([]); // List of travellers
  const [filteredData, setFilteredData] = useState([]); // Filtered traveller list
  const [selectedTraveller, setSelectedTraveller] = useState(null); // Selected traveller
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [isLoading, setIsLoading] = useState(false);
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
    if (singleQuote) {
      setFormState({
        destination: singleQuote.destination?._id || "",
        startDate: singleQuote.startDate?.split("T")[0] || "",
        endDate: singleQuote.endDate?.split("T")[0] || "",
        numberOfAdultTravellers: singleQuote.numberOfAdultTravellers,
        numberOfTravellers: singleQuote.numberOfTravellers,
        numberChildTravellers: singleQuote.numberChildTravellers,
      });
      setSelectedTraveller(
        singleQuote.travellers?.[0]
          ? {
              id: singleQuote.travellers[0]._id,
              name: singleQuote.travellers[0].name,
            }
          : null
      );
    }
  }, [singleQuote]);

  useEffect(() => {
    axios
      .get(`${serverUrl}/api/traveller/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setData(res.data.travellers);
        setFilteredData(res.data.travellers);
      });

    axios.get(`${serverUrl}/api/destination/destinaions`).then((res) => {
      setDestinationAll(res.data.data);
    });
  }, []);

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

  const handleTravelerSelection = (travellerId, travellerName) => {
    if (selectedTraveller && selectedTraveller.id === travellerId) {
      setSelectedTraveller(null);
    } else {
      setSelectedTraveller({ id: travellerId, name: travellerName });
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
      travellers: selectedTraveller ? [selectedTraveller.id] : [],
      numberOfTravellers:
        Number(formState.numberChildTravellers) +
        Number(formState.numberOfAdultTravellers),
      numberChildTravellers: formState.numberChildTravellers,
      numberOfAdultTravellers: formState.numberOfAdultTravellers,
    };

    axios
      .patch(`${serverUrl}/api/quote/edit/${singleQuote._id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setIsLoading(false);
        toast.success("Quote updated successfully");
        getAlldata();
        onClose();
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.response?.data?.message || "Something went wrong");
      });
  };

  const options = destinationAll.map((destination) => ({
    value: destination._id,
    label: destination.title,
  }));

  console.log(selectedTraveller)

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-4/5 max-w-[90%] max-h-[90vh] overflow-y-auto rounded-lg bg-white text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center justify-end text-2xl font-semibold">
          <AiOutlineClose
            className="cursor-pointer text-red-500 hover:text-white hover:bg-main rounded-full p-1"
            size={24}
            onClick={onClose}
          />
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex gap-10">
            <div className="w-[70%]">
              {/* Destination, dates, and traveler counts */}
              <div className="flex justify-between items-center m-auto gap-10 mt-5">
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
              <div className="text-start w-[50%] mt-5 mb-5 flex justify-start item-center gap-1">
                <strong>Selected traveller : </strong>
                <div>{" " + selectedTraveller?.name}</div>
              </div>
            </div>
            <div className="border border-2 border-gray"></div>
            <div className="w-[30%] overflow-y-auto mt-5">
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
              <div className="text-start mt-5 flex items-center">
                <strong>Traveller list:</strong>
              </div>
              <div className="mt-3 h-[280px] overflow-y-auto  sidebar">
                {filteredData.map((el) => (
                  <div
                    key={el._id}
                    className="flex justify-start items-center m-auto gap-5 mt-5"
                  >
                    <input
                      type="radio"
                      checked={selectedTraveller?.id === el._id}
                      onChange={() => handleTravelerSelection(el._id, el.name)}
                    />
                    <span>{el.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button className="bg-main" type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Quote"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuote;
