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
  const [data, setData] = useState([]); // List of travelers
  const [selectedTravellers, setSelectedTravellers] = useState([]); // Selected travelers
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
      setSelectedTravellers(
        singleQuote.travellers?.map((t) => ({ id: t._id, name: t.name }))
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
      });

    axios.get(`${serverUrl}/api/destination/destinaions`).then((res) => {
      setDestinationAll(res.data.data);
    });
  }, []);

  const handleTravelerSelection = (travellerId, travellerName) => {
    setSelectedTravellers((prevSelected) => {
      if (prevSelected.some((t) => t.id === travellerId)) {
        return prevSelected.filter((t) => t.id !== travellerId);
      } else {
        return [...prevSelected, { id: travellerId, name: travellerName }];
      }
    });
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
      .patch(`${serverUrl}/api/quote/edit/${singleQuote._id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        toast.success("Quote updated successfully");
        getAlldata();
        onClose();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        if (error.response) {
          const status = error.response.status;
          const errorMessage =
            error.response.data.message || "Something went wrong";
          switch (status) {
            case 400:
              toast.error(`Bad Request: ${errorMessage}`);
              break;
            case 401:
              toast.error("Unauthorized: Please log in again.");
              break;
            case 403:
              toast.error(
                "Forbidden: You do not have permission to perform this action."
              );
              break;
            case 404:
              toast.error(
                "Not Found: The requested resource could not be found."
              );
              break;
            case 500:
              toast.error("Server Error: Please try again later.");
              break;
            default:
              toast.error(`Error: ${errorMessage}`);
          }
        } else if (error.request) {
          toast.error("Network Error: No response received from the server.");
        } else {
          toast.error(`Error: ${error.message}`);
        }
      });
  };

  const options = destinationAll.map((destination) => ({
    value: destination._id,
    label: destination.title,
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="sidebar relative m-4 w-4/5 max-w-[90%] max-h-[90vh] overflow-y-auto rounded-lg bg-white text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center justify-end font-sans text-2xl font-semibold text-blue-gray-900">
          <AiOutlineClose
            className="cursor-pointer text-sm text-red-500 hover:bg-main hover:text-white rounded-[50%] p-1"
            size={24}
            onClick={onClose}
          />
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex justify-between m-auto gap-10 mt-5">
            <div className="w-[70%]">
              <div className="flex justify-between items-center m-auto gap-10 mt-5">
                {/* react-select component */}
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
                    name="numberChildTravellers"
                    type="number"
                    value={formState.numberChildTravellers}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="w-[50%]">
                  <Input
                    label="No. of child travellers"
                    name="numberOfAdultTravellers"
                    type="number"
                    value={formState.numberOfAdultTravellers}
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
                />
                <Input
                  label="End date"
                  name="endDate"
                  type="date"
                  value={formState.endDate}
                  onChange={handleInputChange}
                />
              </div>

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
            <div className="border border-2 border-gray"></div>
            <div className="w-[30%] overflow-y-auto">
              <div className="text-start mt-5 mb-5">
                <strong>Traveller list:</strong>
              </div>
              <div className="h-[350px] overflow-y-scroll sidebar">
                {data?.map((el) => (
                  <div
                    className="flex justify-start items-center m-auto gap-10 mt-5"
                    key={el._id}
                  >
                    <input
                      type="checkbox"
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
              {isLoading ? "Updating Quote..." : "Update Quote"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuote;
