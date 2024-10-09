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
  const [selectedCategory, setSelectedCategory] = useState("Travel Summary");
  const [travelSummaryPerDay, setTravelSummaryPerDay] = useState([
    {
      day: 1,
      selectedSummary: "",
      summaryDetails: { title: "", description: "" },
    },
  ]);

  const [activityPerDay, setActivityPerDay] = useState([
    {
      day: 1,
      selectedSummary: "",
      summaryDetails: { title: "", description: "" },
    },
  ]);

  const [travelSummaryAll, setTravelSummaryAll] = useState([]);
  const [otherinformation, setOtherinformation] = useState({});
  const [activityAll, setActivityAll] = useState([]);
  const [inclusionAll, setInclusionAll] = useState({});
  const [exclusionAll, setExclusionAll] = useState({});
  const [transfer, setTransfer] = useState({});
  const [data, setData] = useState([]);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [adultPrice, setAdultPrice] = useState(100); // Default adult price
  const [childPrice, setChildPrice] = useState(50); // Default child price

  useEffect(() => {
    axios.get(`${serverUrl}/api/travel-summary/travel-summary`).then((res) => {
      setTravelSummaryAll(res.data.travelSummaries);
    });

    axios.get(`${serverUrl}/api/activity/all`).then((res) => {
      setActivityAll(res.data.data);
    });

    axios.get(`${serverUrl}/api/quote/quotes/${tripid}`).then((res) => {
      setData(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (data?.destination?._id) {
      axios
        .get(
          `${serverUrl}/api/other-information/destination/${data?.destination?._id}`
        )
        .then((res) => {
          console.log(res);
          setOtherinformation(res.data.data.itemList || []);
        });

      axios
        .get(`${serverUrl}/api/inclusion/destination/${data?.destination?._id}`)
        .then((res) => {
          console.log(res);
          setInclusionAll(res.data.data.itemList || []);
        });

      axios
        .get(`${serverUrl}/api/exclusion/destination/${data?.destination?._id}`)
        .then((res) => {
          setExclusionAll(res.data.data.itemList || []);
        });

      axios
        .get(`${serverUrl}/api/transfer/destination/${data?.destination?._id}`)
        .then((res) => {
          setTransfer(res.data.data.itemList || []);
        });
    }
  }, [data?.destination?._id]);
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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const addTravelSummaryDay = () => {
    setTravelSummaryPerDay([
      ...travelSummaryPerDay,
      {
        day: travelSummaryPerDay.length + 1,
        selectedSummary: "",
        summaryDetails: { title: "", description: "" },
      },
    ]);
  };

  const addActivityDay = () => {
    setActivityPerDay([
      ...activityPerDay,
      {
        day: activityPerDay.length + 1,
        selectedSummary: "",
        summaryDetails: { title: "", description: "" },
      },
    ]);
  };

  const handleSelectChange = (selectedOption, dayIndex) => {
    const updatedSummary = travelSummaryPerDay.map((item, index) => {
      if (index === dayIndex) {
        return {
          ...item,
          selectedSummary: selectedOption?.value || "",
          summaryDetails: travelSummaryAll?.find(
            (option) => option._id === selectedOption?.value
          ) || { title: "", description: "" },
        };
      }
      return item;
    });
    setTravelSummaryPerDay(updatedSummary);
  };

  const handleSelectChangeActivity = (selectedOption, dayIndex) => {
    const updatedSummary = activityPerDay.map((item, index) => {
      if (index === dayIndex) {
        return {
          ...item,
          selectedSummary: selectedOption?.value || "",
          summaryDetails: activityAll?.find(
            (option) => option._id === selectedOption?.value
          ) || { title: "", description: "" },
        };
      }
      return item;
    });
    setActivityPerDay(updatedSummary);
  };

  const handleInputChange = (e, field, dayIndex) => {
    const updatedSummary = travelSummaryPerDay.map((item, index) => {
      if (index === dayIndex) {
        return {
          ...item,
          summaryDetails: {
            ...item.summaryDetails,
            [field]: e.target.value,
          },
        };
      }
      return item;
    });
    setTravelSummaryPerDay(updatedSummary);
  };

  const handleInputChangeActivity = (e, field, dayIndex) => {
    const updatedSummary = activityPerDay.map((item, index) => {
      if (index === dayIndex) {
        return {
          ...item,
          summaryDetails: {
            ...item.summaryDetails,
            [field]: e.target.value,
          },
        };
      }
      return item;
    });
    setActivityPerDay(updatedSummary);
  };

  const handleOtherInfoChange = (e, field, index) => {
    const updatedOtherInfo = otherinformation?.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          [field]: e.target.value,
        };
      }
      return item;
    });
    setOtherinformation(updatedOtherInfo);
  };

  const handleOtherInfoChangeTransfer = (e, field, index) => {
    const updatedOtherInfo = transfer?.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          [field]: e.target.value,
        };
      }
      return item;
    });
    setTransfer(updatedOtherInfo);
  };

  const handleOtherInfoChangeExclusion = (e, field, index) => {
    const updatedOtherInfo = exclusionAll?.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          [field]: e.target.value,
        };
      }
      return item;
    });
    setExclusionAll(updatedOtherInfo);
  };

  const handleInclusionChange = (e, field, index) => {
    const updatedInclusions = inclusionAll.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          [field]: e.target.value,
        };
      }
      return item;
    });
    setInclusionAll(updatedInclusions);
  };

  const handleDescriptionChange = (e, inclusionIndex, descriptionIndex) => {
    const updatedInclusions = inclusionAll.map((item, idx) => {
      if (idx === inclusionIndex) {
        const updatedDescriptions = item.description.map((desc, dIdx) => {
          if (dIdx === descriptionIndex) {
            return e.target.value; // Update the specific description
          }
          return desc;
        });
        return {
          ...item,
          description: updatedDescriptions,
        };
      }
      return item;
    });
    setInclusionAll(updatedInclusions);
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

  // Function to calculate total cost
  const calculateTotal = () => {
    return adultCount * adultPrice + childCount * childPrice;
  };

  const handleFinalSubmit = () => {
    console.log({
      travelSummaryPerDay,
      activityPerDay,
      travelSummaryAll,
      otherinformation,
      activityAll,
      inclusionAll,
      exclusionAll,
      transfer,
    });
  };

  return (
    <div className="flex gap-5">
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

              <div className="w-[80%] bg-white p-4 rounded-lg col-span-2">
                {selectedCategory === "Travel Summary" && (
                  <>
                    <div className="flex justify-between items-center gap-5 mb-4">
                      <Button
                        onClick={addTravelSummaryDay}
                        className="bg-main text-white"
                      >
                        Add Another Day
                      </Button>
                    </div>

                    {travelSummaryPerDay.map((item, index) => (
                      <div key={index} className="mb-4">
                        <div className="mt-5 mb-5 text-lg font-normal">
                          Day {item.day}
                        </div>

                        <div className="flex justify-between items-center gap-5">
                          <div className="w-[70%]">
                            <Select
                              options={options}
                              value={options.find(
                                (option) =>
                                  option.value === item.selectedSummary
                              )}
                              onChange={(selectedOption) =>
                                handleSelectChange(selectedOption, index)
                              }
                              placeholder="Select a travel summary"
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
                                handleInputChange(e, "title", index)
                              }
                              placeholder="Edit travel summary title"
                            />
                            <Textarea
                              label={`Description ${index + 1}`}
                              value={item.summaryDetails.description}
                              onChange={(e) =>
                                handleInputChange(e, "description", index)
                              }
                              placeholder="Edit travel summary description"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}

                {selectedCategory === "Activity" && (
                  <>
                    <div className="flex justify-between items-center gap-5 mb-4">
                      <Button
                        onClick={addActivityDay}
                        className="bg-main text-white"
                      >
                        Add Another Day
                      </Button>
                    </div>

                    {activityPerDay.map((item, index) => (
                      <div key={index} className="mb-4">
                        <div className="mt-5 mb-5 text-lg font-normal">
                          Day {item.day}
                        </div>

                        <div className="flex justify-between items-center gap-5">
                          <div className="w-[70%]">
                            <Select
                              options={optionsActivity} // Use optionsActivity here
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
                            <Textarea
                              value={item.summaryDetails.description}
                              onChange={(e) =>
                                handleInputChangeActivity(
                                  e,
                                  "description",
                                  index
                                )
                              }
                              label={`Description ${index + 1}`}
                              placeholder="Edit activity description"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
                {selectedCategory === "Other Information" && (
                  <>
                    <div className="mt-5 mb-5 text-lg font-normal">
                      Other Information details
                    </div>
                    <div className="flex justify-between hover:bg-gray-100 p-2">
                      <div className="flex flex-col gap-4">
                        {otherinformation?.map((el, index) => (
                          <div
                            key={index}
                            className="w-[100%] flex flex-col gap-4 mt-4"
                          >
                            <div className="w-[100%] ">
                              <Input
                                label={`Title ${index + 1}`}
                                value={el.title}
                                onChange={(e) =>
                                  handleOtherInfoChange(e, "title", index)
                                }
                                placeholder="Edit title"
                              />
                            </div>
                            <div className="w-[100%] ">
                              <Textarea
                                label={`Description ${index + 1}`}
                                value={el.description}
                                onChange={(e) =>
                                  handleOtherInfoChange(e, "description", index)
                                }
                                placeholder="Edit description"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={handleFinalSubmit}
                      className={"bg-main text-white"}
                    >
                      Final submit
                    </Button>
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
                            {transfer?.map((el, index) => (
                              <div
                                key={index}
                                className="w-[100%] flex flex-col gap-4 mt-4"
                              >
                                <Input
                                  label={`Title ${index + 1}`}
                                  value={el.title}
                                  onChange={(e) =>
                                    handleOtherInfoChangeTransfer(
                                      e,
                                      "title",
                                      index
                                    )
                                  }
                                  placeholder="Edit title"
                                />
                                <Textarea
                                  label={`Description ${index + 1}`}
                                  value={el.description}
                                  onChange={(e) =>
                                    handleOtherInfoChangeTransfer(
                                      e,
                                      "description",
                                      index
                                    )
                                  }
                                  placeholder="Edit description"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      }
                    </div>
                  </>
                )}

                {selectedCategory === "Inclusion" && (
                  <>
                    <div className="mt-5 mb-5 text-lg font-normal">
                      Inclusion details
                    </div>
                    <div className="flex justify-between hover:bg-gray-100 p-2">
                      <div className="flex flex-col gap-4">
                        {inclusionAll?.map((el, index) => (
                          <div
                            key={index}
                            className="w-[100%] flex flex-col gap-4 mt-4"
                          >
                            <Input
                              label={`Title ${index + 1}`}
                              value={el.title}
                              onChange={(e) =>
                                handleInclusionChange(e, "title", index)
                              }
                              placeholder="Edit title"
                            />
                            {el.description.map((dl, descIndex) => (
                              <Textarea
                                key={descIndex}
                                label={`Description ${descIndex + 1}`}
                                value={dl}
                                onChange={(e) =>
                                  handleDescriptionChange(e, index, descIndex)
                                }
                                placeholder="Edit description"
                              />
                            ))}
                          </div>
                        ))}
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
                            {exclusionAll?.map((el, index) => (
                              <div
                                key={index}
                                className="w-[100%] flex flex-col gap-4 mt-4"
                              >
                                <Input
                                  label={`Title ${index + 1}`}
                                  value={el.title}
                                  onChange={(e) =>
                                    handleOtherInfoChangeExclusion(
                                      e,
                                      "title",
                                      index
                                    )
                                  }
                                  placeholder="Edit title"
                                />
                                <Textarea
                                  label={`Description ${index + 1}`}
                                  value={el.description}
                                  onChange={(e) =>
                                    handleOtherInfoChangeExclusion(
                                      e,
                                      "description",
                                      index
                                    )
                                  }
                                  placeholder="Edit description"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      }
                    </div>
                  </>
                )}

                {selectedCategory === "Cost (Adult, child)" && (
                  <>
                    <div className="mt-5 mb-5 text-lg font-normal">
                      Cost (Adult, child) details
                    </div>
                    <div className="p-5">
                      <h2 className="text-lg font-bold mb-4">
                        Cost Calculation
                      </h2>

                      {/* Adult Price */}
                      <div className="mb-4">
                        <label className="block mb-2">Adult Price:</label>
                        <Input
                          type="number"
                          value={adultPrice}
                          onChange={(e) =>
                            setAdultPrice(Number(e.target.value))
                          }
                          placeholder="Set adult price"
                        />
                      </div>

                      {/* Child Price */}
                      <div className="mb-4">
                        <label className="block mb-2">Child Price:</label>
                        <Input
                          type="number"
                          value={childPrice}
                          onChange={(e) =>
                            setChildPrice(Number(e.target.value))
                          }
                          placeholder="Set child price"
                        />
                      </div>

                      {/* Adult Count */}
                      <div className="flex items-center mb-4">
                        <span className="mr-2">Adults:</span>
                        <Button
                          color="lightBlue"
                          onClick={() =>
                            setAdultCount((prev) => Math.max(prev - 1, 0))
                          }
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={adultCount}
                          readOnly
                          className="mx-2 w-[60px]"
                        />
                        <Button
                          color="lightBlue"
                          onClick={() => setAdultCount((prev) => prev + 1)}
                        >
                          +
                        </Button>
                      </div>

                      {/* Child Count */}
                      <div className="flex items-center mb-4">
                        <span className="mr-2">Children:</span>
                        <Button
                          color="lightBlue"
                          onClick={() =>
                            setChildCount((prev) => Math.max(prev - 1, 0))
                          }
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={childCount}
                          readOnly
                          className="mx-2 w-[60px]"
                        />
                        <Button
                          color="lightBlue"
                          onClick={() => setChildCount((prev) => prev + 1)}
                        >
                          +
                        </Button>
                      </div>

                      {/* Total Cost Display */}
                      <div className="border border-gray-300 p-4 rounded-md mt-4">
                        <h3 className="font-semibold">Total Cost:</h3>
                        <p className="text-xl font-bold">
                          Rs. {calculateTotal()}
                        </p>
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

// {selectedCategory === "Activity" && (
//   <>
//     <div className="flex justify-between items-center gap-5">
//       <div className="w-[70%]">
//         {/* react-select component */}
//         <Select
//           options={optionsActivity} // The options fetched from API
//           value={optionsActivity?.find(
//             (option) => option.value === selectedActivity
//           )} // Pre-select the value if needed
//           onChange={(selectedOption) => {
//             setSelectedActivity(selectedOption?.value || "");
//             setSingleActivity(
//               optionsActivity?.find(
//                 (option) => option.value === selectedActivity
//               )
//             );
//           }} // Handle selection
//           placeholder="Select an activity"
//           isSearchable={true}
//           isClearable={true} // Allows clearing the selection
//         />
//       </div>
//       <Button
//         onClick={addItineraryDay}
//         className="bg-main text-white"
//       >
//         Add Another Day
//       </Button>
//     </div>

//     {detailedItinerary.map((item, index) => (
//       <div key={index} className="mb-4">
//         <div className="mt-5 mb-5 text-lg font-normal">
//           Day {item.day}
//         </div>
//         {
//           <div className="flex justify-between items-center hover:bg-gray-100 p-2">
//             <div>
//               <div>Title : {singleActivity?.label}</div>
//               <div>
//                 Description : {singleActivity?.description}
//               </div>
//             </div>
//             <div className="border border-main text-main py-1 px-3 rounded-md cursor-pointer">
//               Edit
//             </div>
//           </div>
//         }
//       </div>
//     ))}
//   </>
// )}

// {selectedCategory === "Transfers" && (
//   <>
//     <div className="mt-5 mb-5 text-lg font-normal">
//       Transfer details
//     </div>
//     <div className="flex justify-between hover:bg-gray-100 p-2">
//       {
//         <div className="flex justify-between items-center hover:bg-gray-100 p-2">
//           <div>
//             {transfer?.itemList?.map((el, index) => {
//               return (
//                 <div className={`mb-5`}>
//                   <div>Title : {el.title}</div>
//                   <div>Description : {el.description}</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       }
//       <div className="h-[35px] border border-main text-main py-1 px-3 rounded-md cursor-pointer">
//         Edit
//       </div>
//     </div>
//   </>
// )}

// {selectedCategory === "Inclusion" && (
//   <>
//     <div className="mt-5 mb-5 text-lg font-normal">
//       Inclusion details
//     </div>
//     <div className="flex justify-between hover:bg-gray-100 p-2">
//       {
//         <div className="flex justify-between items-center hover:bg-gray-100 p-2">
//           <div>
//             {inclusionAll?.itemList?.map((el, index) => {
//               return (
//                 <div className={`mb-5`}>
//                   <div>Title : {el.title}</div>
//                   <div>Description : {el.description}</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       }
//       <div className="h-[35px] border border-main text-main py-1 px-3 rounded-md cursor-pointer">
//         Edit
//       </div>
//     </div>
//   </>
// )}

// {selectedCategory === "Exclusion" && (
//   <>
//     <div className="mt-5 mb-5 text-lg font-normal">
//       Exclusion details
//     </div>
//     <div className="flex justify-between hover:bg-gray-100 p-2">
//       {
//         <div className="flex justify-between items-center hover:bg-gray-100 p-2">
//           <div>
//             {exclusionAll?.itemList?.map((el, index) => {
//               return (
//                 <div className={`mb-5`}>
//                   <div>Title : {el.title}</div>
//                   <div>Description : {el.description}</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       }
//       <div className="h-[35px] border border-main text-main py-1 px-3 rounded-md cursor-pointer">
//         Edit
//       </div>
//     </div>
//   </>
// )}

// {selectedCategory === "Other Information" && (
//   <>
//     <div className="mt-5 mb-5 text-lg font-normal">
//       Other Information details
//     </div>
//     <div className="flex justify-between hover:bg-gray-100 p-2">
//       {
//         <div className="flex justify-between items-center hover:bg-gray-100 p-2">
//           <div>
//             {otherinformation?.itemList?.map((el, index) => {
//               return (
//                 <div className={`mb-5`}>
//                   <div>Title : {el.title}</div>
//                   <div>Description : {el.description}</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       }
//       <div className="h-[35px] border border-main text-main py-1 px-3 rounded-md cursor-pointer">
//         Edit
//       </div>
//     </div>
//   </>
// )}
