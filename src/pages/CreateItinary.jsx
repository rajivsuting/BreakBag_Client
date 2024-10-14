import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  Button,
  Input,
  List,
  ListItem,
  Textarea,
} from "@material-tailwind/react";
import { MdDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";
import { LuPlusCircle } from "react-icons/lu";

import { Card, CardBody } from "@material-tailwind/react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import AddActivities from "../components/AddActivities";
import { serverUrl } from "../api";
import axios from "axios";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { FiInfo } from "react-icons/fi";
import { IoMdSearch } from "react-icons/io";

const CreateItinerary = () => {
  const { tripid } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("Travel Summary");
  const [allTravelData, setAllTravelData] = useState([]);
  const [originalTravelData, setOriginalTravelData] = useState([]);
  const [allExclusion, setAllExclusion] = useState([]);
  const [originalExclusion, setOriginalExclusion] = useState([]);
  const [singleExclusion, setSingleExclusion] = useState({});
  const [allTransfer, setAllTransfer] = useState([]);
  const [originalTransfer, setOriginalTransfer] = useState([]);
  const [singleTransfer, setSingleTransfer] = useState({});
  const [allOtherInformation, setAllOtherInformation] = useState([]);
  const [originalOtherInformation, setOriginalOtherInformation] = useState([]);
  const [singleOtherInformation, setSingleOtherInformation] = useState({});
  const [data, setData] = useState([]);
  const [adultPrice, setAdultPrice] = useState(0); // Default adult price
  const [childPrice, setChildPrice] = useState(0); // Default child price
  const [priceDetails, setPriceDetails] = useState([]); // To store the formatted data

  // State to manage travel summaries per day
  const [travelSummaryPerDay, setTravelSummaryPerDay] = useState([
    { day: 1, summaryDetails: { title: "", description: "" }, isSaved: false },
  ]);

  // State for managing search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermExclusion, setSearchTermExclusion] = useState("");
  const [searchTermTransfer, setSearchTermTransfer] = useState("");
  const [searchTermOtherInformation, setSearchTermOtherInformation] = useState("");

  // State for active day (the one that is being edited/viewed)
  const [activeDay, setActiveDay] = useState(1);

  // Add a new travel summary day
  const addTravelSummaryDay = () => {
    const newDay = travelSummaryPerDay.length + 1;
    setTravelSummaryPerDay([
      ...travelSummaryPerDay,
      {
        day: newDay,
        summaryDetails: { title: "", description: "" },
        isSaved: false,
      },
    ]);
    setActiveDay(newDay);
  };

  // Handle selecting a travel summary from the list
  const handleSelectSummary = (summary) => {
    const updatedSummaries = [...travelSummaryPerDay];
    const dayIndex = activeDay - 1; // Correct day index for updating the specific day
    updatedSummaries[dayIndex].summaryDetails = summary;
    setTravelSummaryPerDay(updatedSummaries);
  };

  const deleteTravelSummaryDay = (dayIndex) => {
    const updatedSummaries = travelSummaryPerDay.filter(
      (summary, index) => index !== dayIndex
    );

    // Update the day values for each remaining summary
    const reindexedSummaries = updatedSummaries.map((summary, index) => ({
      ...summary,
      day: index + 1, // Reassign day number sequentially
    }));

    setTravelSummaryPerDay(reindexedSummaries);

    // Set the active day to a valid day after deletion, default to day 1
    setActiveDay(reindexedSummaries.length > 0 ? reindexedSummaries[0].day : 1);
  };

  useEffect(() => {
    axios.get(`${serverUrl}/api/quote/quotes/${tripid}`).then((res) => {
      setData(res.data.data);
    });

    axios.get(`${serverUrl}/api/travel-summary/travel-summary/`).then((res) => {
      setAllTravelData(res.data.travelSummaries);
      setOriginalTravelData(res.data.travelSummaries); // Store original data
    });

    axios.get(`${serverUrl}/api/exclusion/exclusions/`).then((res) => {
      setAllExclusion(res.data.data);
      setOriginalExclusion(res.data.data); // Store original data
    });

    axios.get(`${serverUrl}/api/transfer/transfers/`).then((res) => {
      // console.log(res)
      setAllTransfer(res.data.data);
      setOriginalTransfer(res.data.data); // Store original data
    });

    axios.get(`${serverUrl}/api/other-information/other-information/`).then((res) => {
      // console.log(res)
      setAllOtherInformation(res.data.data);
      setOriginalOtherInformation(res.data.data); // Store original data
    });
  }, []);

  const categories = [
    "Travel Summary",
    "Hotel details",
    "Activity",
    "Inclusion",
    "Exclusion",
    "Transfers",
    "Other Information",
    "Cost (Adult, child)",
  ];

  const handleSearchTravelSummary = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    axios
      .get(`${serverUrl}/api/travel-summary/search/?keyword=${searchTerm}`)
      .then((res) => {
        console.log(res);
        setAllTravelData(res.data.data);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  const handleSearchExclusion = (e) => {
    e.preventDefault();

    axios
      .get(`${serverUrl}/api/exclusion/search/?keywords=${searchTermExclusion}`)
      .then((res) => {
        setAllExclusion(res.data.data);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  const handleSearchTransfer = (e) => {
    e.preventDefault();

    axios
      .get(`${serverUrl}/api/transfer/search/?keywords=${searchTermTransfer}`)
      .then((res) => {
        setAllTransfer(res.data.data);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  const handleSearchOtherInformation = (e) => {
    e.preventDefault();

    axios
      .get(`${serverUrl}/api/other-information/search/?keywords=${searchTermOtherInformation}`)
      .then((res) => {
        setAllOtherInformation(res.data.data);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  const handleInputChangeExclusion = (e) => {
    const { name, value } = e.target;
    setSingleExclusion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChangeTransfer = (e) => {
    const { name, value } = e.target;
    setSingleTransfer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChangeOtherinformation = (e) => {
    const { name, value } = e.target;
    setSingleOtherInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetSearch = () => {
    setSearchTerm(""); // Clear the search term
    setAllTravelData(originalTravelData); // Reset to original data
  };

  const resetSearchExclusion = () => {
    setSearchTermExclusion(""); // Clear the search term
    setAllExclusion(originalExclusion); // Reset to original data
  };

  const resetSearchTransfer = () => {
    setSearchTermTransfer(""); // Clear the search term
    setAllTransfer(originalTransfer); // Reset to original data
  };


  const resetSearchOtherinformation = () => {
    setSearchTermOtherInformation(""); // Clear the search term
    setAllOtherInformation(originalOtherInformation); // Reset to original data
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const calculateTotal = () => {
    return (
      data?.travellers?.filter((el) => el.userType === "Adult").length *
        adultPrice +
      data?.travellers?.filter((el) => el.userType === "Child").length *
        childPrice
    );
  };

  // Function to update the price details in the desired format
  const updatePriceDetails = () => {
    const adultCount = data?.travellers?.filter(
      (el) => el.userType === "Adult"
    )?.length;
    const childCount = data?.travellers?.filter(
      (el) => el.userType === "Child"
    )?.length;

    const newPriceDetails = [
      {
        userType: "Adult",
        price: adultPrice,
        quantity: adultCount,
        amount: adultPrice * adultCount,
      },
      {
        userType: "Child",
        price: childPrice,
        quantity: childCount,
        amount: childPrice * childCount,
      },
    ];

    setPriceDetails(newPriceDetails);
  };

  // Call updatePriceDetails whenever price or data changes
  useEffect(() => {
    updatePriceDetails();
  }, [adultPrice, childPrice, data]);
  const handleFinalSubmit = () => {
    // console.log({
    //   travelSummaryPerDay,
    //   activityPerDay,
    //   otherinformation,
    //   priceDetails,
    //   inclusionAll,
    //   exclusionAll,
    //   transfer,
    // });
  };

  console.log(singleTransfer)

  return (
    <div className="flex gap-5">
      <Sidebar />
      <div className="w-[100%] m-auto mt-3 rounded-md ml-[20rem] p-4">
        <div>
          <img
            src="/img/lanscape2.jpg"
            className="w-full h-[200px] mb-5 rounded-md"
            alt=""
          />
        </div>
        <Card className="overflow-hidden mt-5">
          <div className="p-8 pb-0 flex justify-between">
            <div className="w-[50%] text-xl text-semibold">
              <span className="px-4 py-2 rounded-md text-sm text-white bg-green-500">
                Active
              </span>{" "}
              {tripid}
            </div>
          </div>
          <CardBody className="p-4">
            <div className="flex justify-between gap-4 p-4">
              <div className="w-[20%] h-[100%] bg-gray-100 p-4 rounded-lg">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className={`p-2 cursor-pointer ${
                      selectedCategory === category
                        ? "border-b-2 border-main text-main font-semibold"
                        : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <span>{category}</span>
                  </div>
                ))}
              </div>
              <div className="w-[50%] bg-white p-4 rounded-lg col-span-2">
                {selectedCategory === "Travel Summary" && (
                  <>
                    <div className="flex justify-between bg-white rounded-lg gap-5">
                      <div className="w-[90%] grid grid-cols-5 gap-2 border-gray-300">
                        {travelSummaryPerDay.map((daySummary, index) => (
                          <div
                            key={index}
                            className={`w-[80px] h-[30px] flex justify-between items-center rounded cursor-pointer text-center py-1 px-2 text-sm ${
                              activeDay === daySummary.day
                                ? "border border-main bg-main text-white"
                                : "border border-main text-main"
                            }`}
                            onClick={() => setActiveDay(daySummary.day)}
                          >
                            Day {daySummary.day}{" "}
                            <AiOutlineClose
                              className={`cursor-pointer text-sm hover:bg-main hover:text-white rounded-[50%] p-1 ${
                                activeDay === daySummary.day
                                  ? "text-white"
                                  : "text-main"
                              }`}
                              size={16}
                              onClick={() => deleteTravelSummaryDay(index)}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="w-[5%] relative group">
                        <AiOutlinePlus
                          className="cursor-pointer text-green-500 hover:bg-green-500 hover:text-white rounded-[50%] p-1 "
                          size={24}
                          onClick={addTravelSummaryDay}
                        />

                        <ul className="w-[150px] absolute right-0 shadow text-center hidden bg-white border rounded p-2 text-gray-700 group-hover:block z-10">
                          <li className="flex justify-center items-center gap-2 w-full text-xs font-semibold">
                            <FiInfo className="font-bold" /> Add new date
                          </li>
                        </ul>
                      </div>
                    </div>

                    {travelSummaryPerDay.map((daySummary, index) =>
                      activeDay === daySummary.day ? (
                        <div key={index} className="mb-4">
                          <div className="mt-5 mb-5 text-lg font-normal">
                            Day {daySummary.day}
                          </div>

                          <div className="flex flex-col gap-4 mt-4">
                            <Input
                              label={`Title`}
                              value={daySummary.summaryDetails.title}
                              placeholder="Edit travel summary title"
                              onChange={(e) => {
                                const updatedSummaries = [
                                  ...travelSummaryPerDay,
                                ];
                                updatedSummaries[index].summaryDetails.title =
                                  e.target.value;
                                setTravelSummaryPerDay(updatedSummaries);
                              }}
                            />
                            <Textarea
                              label={`Description`}
                              value={daySummary.summaryDetails.description}
                              className="min-h-[50px] h-auto"
                              onChange={(e) => {
                                const updatedSummaries = [
                                  ...travelSummaryPerDay,
                                ];
                                updatedSummaries[
                                  index
                                ].summaryDetails.description = e.target.value;
                                setTravelSummaryPerDay(updatedSummaries);
                              }}
                            />
                          </div>
                        </div>
                      ) : null
                    )}
                  </>
                )}

                {selectedCategory === "Exclusion" && (
                  <>
                    <div className="mt-5 mb-5 text-lg font-normal">
                      Exclusion details
                    </div>
                    <div className="flex flex-col w-full gap-5 p-2">
                      <Input
                        label={`Title`}
                        value={singleExclusion?.title}
                        name="title"
                        onChange={handleInputChangeExclusion}
                      />
                      <Textarea
                        label={`Description`}
                        name="description"
                        value={singleExclusion?.description}
                        className="min-h-[50px] h-auto w-full" // Adjusted to 100% width
                        onChange={handleInputChangeExclusion}
                      />
                    </div>
                  </>
                )}

                {selectedCategory === "Transfers" && (
                  <>
                    <div className="mt-5 mb-5 text-lg font-normal">
                      Transfer details
                    </div>
                    <div className="flex flex-col w-full gap-5 p-2">
                      <Input
                        label={`Title`}
                        value={singleTransfer?.title}
                        name="title"
                        onChange={handleInputChangeTransfer}
                      />
                      <Textarea
                        label={`Description`}
                        name="description"
                        value={singleTransfer?.description}
                        className="min-h-[50px] h-auto w-full" // Adjusted to 100% width
                        onChange={handleInputChangeTransfer}
                      />
                    </div>
                  </>
                )}


{selectedCategory === "Other Information" && (
                  <>
                    <div className="mt-5 mb-5 text-lg font-normal">
                      Other information details
                    </div>
                    <div className="flex flex-col w-full gap-5 p-2">
                      <Input
                        label={`Title`}
                        value={singleOtherInformation?.title}
                        name="title"
                        onChange={handleInputChangeOtherinformation}
                      />
                      <Textarea
                        label={`Description`}
                        name="description"
                        value={singleOtherInformation?.description}
                        className="min-h-[50px] h-auto w-full" // Adjusted to 100% width
                        onChange={handleInputChangeOtherinformation}
                      />
                    </div>
                  </>
                )}
              </div>

              

              {selectedCategory === "Travel Summary" && (
                <div className="w-[30%] h-[400px]  bg-gray-100 p-4 rounded-lg shadow-md flex flex-col">
                  <form
                    onSubmit={handleSearchTravelSummary}
                    className="mb-4 flex justify-between items-center gap-2"
                  >
                    <div className="relative w-[85%]">
                      <Input
                        label="Search travel summaries"
                        className="w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        required
                      />
                      {/* Cross icon to clear the search */}
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={resetSearch}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                        >
                          &times;{" "}
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-[15%] bg-main px-2 py-2 text-xl text-white cursor-pointer rounded flex justify-center items-center"
                    >
                      <IoMdSearch />
                    </button>
                  </form>

                  <div className="flex-1 overflow-y-auto sidebar">
                    <List className="border-t border-gray-300">
                      {allTravelData?.length > 0 ? (
                        allTravelData.map((summary, index) => (
                          <div
                            key={index}
                            className="py-2 px-2 hover:bg-gray-200 transition-colors cursor-pointer"
                            onClick={() => {
                              handleSelectSummary(summary, 0);
                              resetSearch();
                            }}
                          >
                            <div className="font-bold">{summary.title}</div>
                            <div className="text-gray-600">
                              {summary.description}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-600">
                          No results found
                        </div>
                      )}
                    </List>
                  </div>
                </div>
              )}

              {selectedCategory === "Exclusion" && (
                <div className="w-[30%] h-[400px]  bg-gray-100 p-4 rounded-lg shadow-md flex flex-col">
                  <form
                    onSubmit={handleSearchExclusion}
                    className="mb-4 flex justify-between items-center gap-2"
                  >
                    <div className="relative w-[85%]">
                      <Input
                        label="Search exclusions"
                        className="w-full"
                        value={searchTermExclusion}
                        onChange={(e) => setSearchTermExclusion(e.target.value)}
                        required
                      />
                      {/* Cross icon to clear the search */}
                      {searchTermExclusion && (
                        <button
                          type="button"
                          onClick={resetSearchExclusion}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                        >
                          &times;{" "}
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-[15%] bg-main px-2 py-2 text-xl text-white cursor-pointer rounded flex justify-center items-center"
                    >
                      <IoMdSearch />
                    </button>
                  </form>

                  <div className="flex-1 overflow-y-auto sidebar">
                    <List className="border-t border-gray-300">
                      {allExclusion?.length > 0 ? (
                        allExclusion.map((summary, index) => (
                          <div
                            key={index}
                            className="py-2 px-2 hover:bg-gray-200 transition-colors cursor-pointer"
                            onClick={() => {
                              setSingleExclusion(summary);
                              resetSearchExclusion();
                            }}
                          >
                            <div className="font-bold">{summary.title}</div>
                            <div className="text-gray-600">
                              {summary.description}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-600">
                          No results found
                        </div>
                      )}
                    </List>
                  </div>
                </div>
              )}

              {selectedCategory === "Transfers" && (
                <div className="w-[30%] h-[400px]  bg-gray-100 p-4 rounded-lg shadow-md flex flex-col">
                  <form
                    onSubmit={handleSearchTransfer}
                    className="mb-4 flex justify-between items-center gap-2"
                  >
                    <div className="relative w-[85%]">
                      <Input
                        label="Search transfers"
                        className="w-full"
                        value={searchTermTransfer}
                        onChange={(e) => setSearchTermTransfer(e.target.value)}
                        required
                      />
                      {/* Cross icon to clear the search */}
                      {searchTermTransfer && (
                        <button
                          type="button"
                          onClick={resetSearchTransfer}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                        >
                          &times;{" "}
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-[15%] bg-main px-2 py-2 text-xl text-white cursor-pointer rounded flex justify-center items-center"
                    >
                      <IoMdSearch />
                    </button>
                  </form>

                  <div className="flex-1 overflow-y-auto sidebar">
                    <List className="border-t border-gray-300">
                      {allTransfer?.length > 0 ? (
                        allTransfer.map((summary, index) => (
                          <div
                            key={index}
                            className="py-2 px-2 hover:bg-gray-200 transition-colors cursor-pointer"
                            onClick={() => {
                              setSingleTransfer(summary);
                              resetSearchTransfer();
                            }}
                          >
                            <div className="font-bold">{summary.title}</div>
                            <div className="text-gray-600">
                              {summary.description}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-600">
                          No results found
                        </div>
                      )}
                    </List>
                  </div>
                </div>
              )}



{selectedCategory === "Other Information" && (
                <div className="w-[30%] h-[400px]  bg-gray-100 p-4 rounded-lg shadow-md flex flex-col">
                  <form
                    onSubmit={handleSearchOtherInformation}
                    className="mb-4 flex justify-between items-center gap-2"
                  >
                    <div className="relative w-[85%]">
                      <Input
                        label="Search other ifnormation"
                        className="w-full"
                        value={searchTermOtherInformation}
                        onChange={(e) => setSearchTermOtherInformation(e.target.value)}
                        required
                      />
                      {/* Cross icon to clear the search */}
                      {searchTermOtherInformation && (
                        <button
                          type="button"
                          onClick={resetSearchOtherinformation}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                        >
                          &times;{" "}
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-[15%] bg-main px-2 py-2 text-xl text-white cursor-pointer rounded flex justify-center items-center"
                    >
                      <IoMdSearch />
                    </button>
                  </form>

                  <div className="flex-1 overflow-y-auto sidebar">
                    <List className="border-t border-gray-300">
                      {allOtherInformation?.length > 0 ? (
                        allOtherInformation.map((summary, index) => (
                          <div
                            key={index}
                            className="py-2 px-2 hover:bg-gray-200 transition-colors cursor-pointer"
                            onClick={() => {
                              setSingleOtherInformation(summary);
                              resetSearchOtherinformation();
                            }}
                          >
                            <div className="font-bold">{summary.title}</div>
                            <div className="text-gray-600">
                              {summary.description}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-600">
                          No results found
                        </div>
                      )}
                    </List>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CreateItinerary;

{
  /* {selectedCategory === "Activity" && (
                  <>
                    {data?.duration > activityPerDay?.length ? (
                      <div className="flex justify-between items-center gap-5 mb-4">
                        <Button
                          onClick={addActivityDay}
                          className="bg-main text-white"
                        >
                          Add Another Day
                        </Button>
                      </div>
                    ) : null}
                    {activityPerDay.map((item, index) => (
                      <div key={index} className="mb-4">
                        <div className="mt-5 mb-5 text-lg font-normal">
                          Day {item.day}
                        </div>

                        <div className="flex justify-between items-center gap-5">
                          <div className="w-[70%]">
                            <Select
                              options={optionsActivity}
                              value={optionsActivity.find(
                                (option) =>
                                  option.value === item.selectedSummary
                              )}
                              onChange={(selectedOption) =>
                                handleSelectChangeActivity(
                                  selectedOption,
                                  index
                                )
                              }
                              placeholder="Select an activity"
                              isSearchable={true}
                              isClearable={true}
                            />
                          </div>
                        </div>

                        {item.selectedSummary && (
                          <div className="flex flex-col gap-4 mt-4">
                            <Input
                              label={`Title ${index + 1}`}
                              value={item.summaryDetails.title}
                              onChange={(e) =>
                                handleInputChangeActivity(e, "title", index)
                              }
                              placeholder="Edit activity title"
                            />

            
                            {item.summaryDetails.description?.map(
                              (desc, descIndex) => (
                                <Textarea
                                  key={descIndex}
                                  value={desc}
                                  onChange={(e) =>
                                    handleInputChangeActivity(
                                      e,
                                      "description",
                                      index,
                                      descIndex
                                    )
                                  }
                                  label={`Description ${index + 1} - Part ${
                                    descIndex + 1
                                  }`}
                                  className="min-h-[50px] h-auto"
                                />
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )} */
}

{
  /* {selectedCategory === "Other Information" && (
                  <>
                    <div className="mt-5 mb-5 text-lg font-normal">
                      Other Information details
                    </div>
                    <div className="flex flex-col w-full hover:bg-gray-100 p-2">
                      <div className="w-full">
                        {otherinformation?.map((el, index) => (
                          <div
                            key={index}
                            className="w-[100%] flex flex-col gap-4 mt-4"
                          >
                            <div className="w-[100%] ">
                              <Textarea
                                label={`Description ${index + 1}`}
                                value={el}
                                onChange={(e) =>
                                  handleOtherInfoChange(e, index)
                                }
                                className="min-h-[50px] h-auto"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="m-auto flex justify-center items-center">
                      <Button
                        onClick={handleFinalSubmit}
                        className={"bg-main text-white m-auto w-[200px]"}
                      >
                        Final submit
                      </Button>
                    </div>
                  </>
                )} */
}

{
  /* {selectedCategory === "Transfers" && (
                  <>
                    <div className="mt-5 mb-5 text-lg font-normal">
                      Transfer details
                    </div>
                    <div className="flex flex-col w-full hover:bg-gray-100 p-2">
                      <div className="w-full">
                        {transfer?.map((el, index) => (
                          <div
                            key={index}
                            className="w-full flex flex-col gap-4 mt-4"
                          >
                            <Textarea
                              label={`Description ${index + 1}`}
                              value={el}
                              onChange={(e) =>
                                handleOtherInfoChangeTransfer(
                                  e,

                                  index
                                )
                              }
                              className="min-h-[50px] h-auto"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )} */
}

{
  /* {selectedCategory === "Inclusion" && (
                  <div className="flex">
                 
                    <div className="w-[20%] border-r pr-4">
                      <h3 className="font-bold">Titles</h3>
                      <div className="w-[100%] h-full bg-gray-100 p-4 rounded-lg overflow-y-auto">
                        {inclusionAll?.map((item, index) => (
                          <div
                            key={index}
                            className={`p-2 cursor-pointer ${
                              selectedIndex === index
                                ? "border-b-2 border-main text-main font-semibold"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedTitle(item.title);
                              setSelectedIndex(index);
                            }}
                          >
                            {item.title}
                          </div>
                        ))}
                      </div>
                    </div>

         
                    <div className="w-[80%] pl-4">
                      <h3 className="font-bold mb-4">
                        Descriptions for "{selectedTitle}"
                      </h3>
                      {inclusionAll[selectedIndex]?.description?.map(
                        (desc, descIndex) => (
                          <div key={descIndex} className="flex gap-5 mb-4">
                            <Textarea
                              label={`Description ${descIndex + 1}`}
                              value={desc}
                              onChange={(e) =>
                                handleDescriptionChange(e, descIndex)
                              }
                              className="min-h-[50px] h-auto" // Adjusted height
                              required
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )} */
}

{
  /* {selectedCategory === "Cost (Adult, child)" && (
                  <div className="mt-2 mb-2 text-lg font-normal">
                    Cost (Adult, child) details
                    <div className="p-5">
                      <h2 className="text-lg font-bold mb-4">
                        {
                          data?.travellers?.filter(
                            (el) => el.userType === "Adult"
                          )?.length
                        }{" "}
                        Adults and{" "}
                        {
                          data?.travellers?.filter(
                            (el) => el.userType === "Child"
                          )?.length
                        }{" "}
                        Child
                      </h2>

                      <div className="flex justify-between items-center mb-2 gap-5">
                        <label className="w-[50%] block mb-2">
                          Adult Price:
                        </label>
                        <label className="w-[50%] block mb-2">
                          Child Price:
                        </label>
                      </div>

                
                      <div className="flex justify-between items-center mb-2 gap-5">
                        <Input
                          type="number"
                          value={adultPrice}
                          onChange={(e) =>
                            setAdultPrice(Number(e.target.value))
                          }
                          placeholder="Set adult price"
                        />
                        <Input
                          type="number"
                          value={childPrice}
                          onChange={(e) =>
                            setChildPrice(Number(e.target.value))
                          }
                          placeholder="Set child price"
                        />
                      </div>

            
                      <div className="border border-gray-300 p-4 rounded-md mt-4">
                        <h3 className="font-semibold">Total Cost:</h3>
                        <p className="text-xl font-bold">
                          Rs. {calculateTotal()}
                        </p>
                      </div>
                    </div>
                  </div>
                )} */
}
