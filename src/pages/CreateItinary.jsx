import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Button, Input, Textarea } from "@material-tailwind/react";
import { MdDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";
import { LuPlusCircle } from "react-icons/lu";

import { Card, CardBody } from "@material-tailwind/react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import AddActivities from "../components/AddActivities";
import { serverUrl } from "../api";
import axios from "axios";
import { useParams } from "react-router-dom";
import Select from "react-select";

const CreateItinerary = () => {
  const { tripid } = useParams();
  const [isAddTravelSummaryModal, setIsAddTravelSummaryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Travel Summary"); // Set default to "Travel Summary"
  const [travelSummary, setTravelSummary] = useState([{ day: 1, summary: "" }]);
  const [detailedItinerary, setDetailedItinerary] = useState([
    { day: 1, itinerary: "" },
  ]);
  const [data, setData] = useState([]);
  const [travelSummaryAll, setTravelSummaryAll] = useState([]);
  const [selectedTravelSummary, setSelectedTravelSummary] = useState("");
  const [activityAll, setActivityAll] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [singleTravelSummery, setSingleTravelSummery] = useState({});
  const [singleActivity, setSingleActivity] = useState([]);
  const [inclusionAll, setInclusionAll] = useState({});
  const [exclusionAll, setExclusionAll] = useState({});
  const [otherinformation, setOtherinformation] = useState({});
  const [transfer, setTransfer] = useState({});

  const categories = [
    "Travel Summary",
    "Cost (Adult, child)",
    "Total Cost",
    "Transfers",
    "Activity",
    "Inclusion",
    "Exclusion",
    "Other Information",
  ];

  // Handle Category Change
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Function to add more days to Travel Summary
  const addTravelSummaryDay = () => {
    setTravelSummary([
      ...travelSummary,
      { day: travelSummary.length + 1, summary: "" },
    ]);
  };

  // Function to add more days to Activity
  const addItineraryDay = () => {
    setDetailedItinerary([
      ...detailedItinerary,
      { day: detailedItinerary.length + 1, itinerary: "" },
    ]);
  };

  const getAllData = () => {
    axios.get(`${serverUrl}/api/quote/quotes/${tripid}`).then((res) => {
      setData(res.data.data);
    });
  };


  useEffect(() => {
    getAllData();
    axios.get(`${serverUrl}/api/travel-summary/travel-summary`).then((res) => {
      setTravelSummaryAll(res.data.travelSummaries);
    });

    axios.get(`${serverUrl}/api/activity/all`).then((res) => {
      setActivityAll(res.data.data);
    });

    axios
      .get(`${serverUrl}/api/inclusion/destination/${data?.destination?._id}`)
      .then((res) => {
        setInclusionAll(res.data.data);
      });

    axios
      .get(`${serverUrl}/api/exclusion/destination/${data?.destination?._id}`)
      .then((res) => {
        setExclusionAll(res.data.data);
      });
    axios
      .get(
        `${serverUrl}/api/other-information/destination/${data?.destination?._id}`
      )
      .then((res) => {
        setOtherinformation(res.data.data);
      });
    axios
      .get(`${serverUrl}/api/transfer/destination/${data?.destination?._id}`)
      .then((res) => {
        setTransfer(res.data.data);
      });

    return () => {
      console.log("Avoid errors");
    };
  }, [data?.destination?._id]);

  // console.log(data?.destination?._id);

  const getStatusColorBackground = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500"; // Green
      case "Quoted":
        return "bg-blue-500"; // Blue
      case "Follow Up":
        return "bg-orange-500"; // Orange
      case "Confirmed":
        return "bg-dark-green-500"; // Dark Green
      case "Cancelled":
        return "bg-red-500"; // Red
      case "CNP":
        return "bg-gray-500"; // Gray
      case "Groups":
        return "bg-purple-500"; // Purple
      default:
        return "bg-black"; // Default color
    }
  };

  const options = travelSummaryAll?.map((destination) => ({
    value: destination._id,
    label: destination.title,
    description: destination.description,
  }));

  const optionsActivity = activityAll?.map((activity) => ({
    value: activity._id,
    label: activity.title,
    description: activity.description,
  }));

  return (
    <div className="flex gap-5 ">
      <Sidebar />
      <div className="w-[75%] m-auto mt-8 rounded-md">
        <div>
          <img
            src="/img/lanscape2.jpg"
            className="w-full h-[200px] mb-5 rounded-md"
            alt=""
          />
        </div>

        <Card className="overflow-hidden mt-5">
          <div className="p-8 pb-0 flex justify-between">
            <div className=" w-[50%] text-xl text-semibold">
              <span
                className={`px-4 py-2 rounded-md text-sm text-white ${getStatusColorBackground(
                  data?.status
                )}`}
              >
                {data?.status}
              </span>{" "}
              {tripid}
            </div>
          </div>
          <CardBody className="p-4">
            <div className="flex justify-between gap-4 p-4">
              {/* Left Panel (Category Selection) */}
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
                    <span className="">{category}</span>
                  </div>
                ))}
              </div>

              {/* Middle Panel (Input Form) */}
              <div className="w-[80%] bg-white p-4 rounded-lg col-span-2">
                {selectedCategory === "Travel Summary" && (
                  <>
                    <div className="flex justify-between items-center gap-5">
                      <div className="w-[70%]">
                        {/* react-select component */}
                        <Select
                          options={options} // The options fetched from API
                          value={options.find(
                            (option) => option.value === selectedTravelSummary
                          )} // Pre-select the value if needed
                          onChange={(selectedOption) => {
                            setSelectedTravelSummary(
                              selectedOption?.value || ""
                            );
                            setSingleTravelSummery(
                              options.find(
                                (option) =>
                                  option.value === selectedTravelSummary
                              )
                            );
                          }} // Handle selection
                          placeholder="Select a travel summary"
                          isSearchable={true}
                          isClearable={true} // Allows clearing the selection
                        />
                      </div>
                      <Button
                        onClick={addTravelSummaryDay}
                        className="bg-main text-white"
                      >
                        Add Another Day
                      </Button>
                    </div>
                    {travelSummary.map((item, index) => (
                      <div key={index} className="mb-4">
                        <div className="mt-5 mb-5 text-lg font-normal">
                          Day {item.day}
                        </div>
                        {selectedTravelSummary ? (
                          <div className="flex justify-between items-center hover:bg-gray-100 p-2">
                            <div>
                              <div>Title : {singleTravelSummery?.label}</div>
                              <div>
                                Description : {singleTravelSummery?.description}
                              </div>
                            </div>
                            <div className="border border-main text-main py-1 px-3 rounded-md cursor-pointer">
                              Edit
                            </div>
                          </div>
                        ) : (
                          <div className="text-main text-center">
                            No travel summery selected, please select one first
                          </div>
                        )}
                        {/* <Input
                          label="Title"
                          value={item.summary}
                          onChange={(e) => {
                            const newSummary = [...travelSummary];
                            newSummary[index].summary = e.target.value;
                            setTravelSummary(newSummary);
                          }}
                        />
                        <div className="mt-5">
                          <Textarea
                            label="Description"
                            value={item.summary}
                            onChange={(e) => {
                              const newSummary = [...travelSummary];
                              newSummary[index].summary = e.target.value;
                              setTravelSummary(newSummary);
                            }}
                          />
                        </div> */}
                      </div>
                    ))}
                  </>
                )}

                {selectedCategory === "Activity" && (
                  <>
                    <div className="flex justify-between items-center gap-5">
                      <div className="w-[70%]">
                        {/* react-select component */}
                        <Select
                          options={optionsActivity} // The options fetched from API
                          value={optionsActivity?.find(
                            (option) => option.value === selectedActivity
                          )} // Pre-select the value if needed
                          onChange={(selectedOption) => {
                            setSelectedActivity(selectedOption?.value || "");
                            setSingleActivity(
                              optionsActivity?.find(
                                (option) => option.value === selectedActivity
                              )
                            );
                          }} // Handle selection
                          placeholder="Select an activity"
                          isSearchable={true}
                          isClearable={true} // Allows clearing the selection
                        />
                      </div>
                      <Button
                        onClick={addItineraryDay}
                        className="bg-main text-white"
                      >
                        Add Another Day
                      </Button>
                    </div>

                    {detailedItinerary.map((item, index) => (
                      <div key={index} className="mb-4">
                        <div className="mt-5 mb-5 text-lg font-normal">
                          Day {item.day}
                        </div>
                        {
                          <div className="flex justify-between items-center hover:bg-gray-100 p-2">
                            <div>
                              <div>Title : {singleActivity?.label}</div>
                              <div>
                                Description : {singleActivity?.description}
                              </div>
                            </div>
                            <div className="border border-main text-main py-1 px-3 rounded-md cursor-pointer">
                              Edit
                            </div>
                          </div>
                        }
                        {/* <Input
                          label="Title"
                          value={item.itinerary}
                          onChange={(e) => {
                            const newItinerary = [...detailedItinerary];
                            newItinerary[index].itinerary = e.target.value;
                            setDetailedItinerary(newItinerary);
                          }}
                        />
                        <div className="mt-5">
                          <Textarea
                            label="Description"
                            value={item.itinerary}
                            onChange={(e) => {
                              const newItinerary = [...detailedItinerary];
                              newItinerary[index].itinerary = e.target.value;
                              setDetailedItinerary(newItinerary);
                            }}
                          />
                        </div> */}
                      </div>
                    ))}
                  </>
                )}

                {selectedCategory === "Transfers" && (
                  <>
                    <div className="mt-5 mb-5 text-lg font-normal">
                      Transfer details
                    </div>
                    <div className="flex justify-between hover:bg-gray-100 p-2">
                      {
                        <div className="flex justify-between items-center hover:bg-gray-100 p-2">
                          <div>
                            {transfer?.itemList?.map((el, index) => {
                              return (
                                <div className={`mb-5`}>
                                  <div>Title : {el.title}</div>
                                  <div>Description : {el.description}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      }
                      <div className="h-[35px] border border-main text-main py-1 px-3 rounded-md cursor-pointer">
                        Edit
                      </div>
                    </div>
                  </>
                )}

                {selectedCategory === "Inclusion" && (
                  <>
                    <div className="mt-5 mb-5 text-lg font-normal">
                      Inclusion details
                    </div>
                    <div className="flex justify-between hover:bg-gray-100 p-2">
                      {
                        <div className="flex justify-between items-center hover:bg-gray-100 p-2">
                          <div>
                            {inclusionAll?.itemList?.map((el, index) => {
                              return (
                                <div className={`mb-5`}>
                                  <div>Title : {el.title}</div>
                                  <div>Description : {el.description}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      }
                      <div className="h-[35px] border border-main text-main py-1 px-3 rounded-md cursor-pointer">
                        Edit
                      </div>
                    </div>
                  </>
                )}

{selectedCategory === "Exclusion" && (
                  <>
                    <div className="mt-5 mb-5 text-lg font-normal">
                      Exclusion details
                    </div>
                    <div className="flex justify-between hover:bg-gray-100 p-2">
                      {
                        <div className="flex justify-between items-center hover:bg-gray-100 p-2">
                          <div>
                            {exclusionAll?.itemList?.map((el, index) => {
                              return (
                                <div className={`mb-5`}>
                                  <div>Title : {el.title}</div>
                                  <div>Description : {el.description}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      }
                      <div className="h-[35px] border border-main text-main py-1 px-3 rounded-md cursor-pointer">
                        Edit
                      </div>
                    </div>
                  </>
                )}


{selectedCategory === "Other Information" && (
                  <>
                    <div className="mt-5 mb-5 text-lg font-normal">
                    Other Information details
                    </div>
                    <div className="flex justify-between hover:bg-gray-100 p-2">
                      {
                        <div className="flex justify-between items-center hover:bg-gray-100 p-2">
                          <div>
                            {otherinformation?.itemList?.map((el, index) => {
                              return (
                                <div className={`mb-5`}>
                                  <div>Title : {el.title}</div>
                                  <div>Description : {el.description}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      }
                      <div className="h-[35px] border border-main text-main py-1 px-3 rounded-md cursor-pointer">
                        Edit
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CreateItinerary;
