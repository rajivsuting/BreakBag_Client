import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Button, Input, List, Textarea } from "@material-tailwind/react";
import { FaSpinner, FaStar } from "react-icons/fa";
import { Card, CardBody } from "@material-tailwind/react";
import { serverUrl } from "../api";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdClose, IoMdSearch } from "react-icons/io";
import { LuMinus } from "react-icons/lu";

const CreateItinerary = () => {
  const { tripid } = useParams();
  const [loadingItinery, setLoadingItinery] = useState();
  const [selectedCategory, setSelectedCategory] = useState("Travel Summary");
  const [allTravelData, setAllTravelData] = useState([]);
  const [originalTravelData, setOriginalTravelData] = useState([]);
  const [allExclusion, setAllExclusion] = useState([]);
  const [originalExclusion, setOriginalExclusion] = useState([]);
  const [selectedExclusions, setSelectedExclusions] = useState([]); // Array for multiple exclusions

  const [allTransfer, setAllTransfer] = useState([]);
  const [originalTransfer, setOriginalTransfer] = useState([]);
  const [selectedTransfers, setSelectedTransfer] = useState([]);

  const [allOtherInformation, setAllOtherInformation] = useState([]);
  const [originalOtherInformation, setOriginalOtherInformation] = useState([]);
  const [selectedOtherInformation, setSelectedOtherInformation] = useState([]);

  const [allHotel, setAllHotel] = useState([]);
  const [originalHotel, setOriginalHotel] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState([]);
  const [showManualForm, setShowManualForm] = useState(false); // To toggle the manual entry form
  const [manualHotel, setManualHotel] = useState({
    name: "",
    formatted_address: "",
    rating: "",
    checkInDate: "",
    checkOutDate: "",
    mealPlan: "",
    numberOfGuest: "",
    roomType: "",
  });

  const [allActivityData, setAllActivityData] = useState([]);
  const [originalActivityData, setOriginalActivityData] = useState([]);

  const [allInclusion, setAllInclusion] = useState([]);
  const [originalInclusion, setOriginalInclusion] = useState([]);
  const [selectedInclusions, setSelectedInclusions] = useState([]);
  const [searchTermInclusion, setSearchTermInclusion] = useState("");
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [adultPrice, setAdultPrice] = useState(""); // Default adult price
  const [childPrice, setChildPrice] = useState(""); // Default child price
  const [priceDetails, setPriceDetails] = useState([]); // To store the formatted data

  // State to manage travel summaries per day
  const [travelSummaryPerDay, setTravelSummaryPerDay] = useState([
    { day: 1, summaryDetails: { title: "", description: "" }, isSaved: false },
  ]);

  const [activityPerDay, setActivityPerDay] = useState([
    {
      day: 1,
      summaryDetails: { title: "", description: [""] },
      isSaved: false,
    },
  ]);

  // State for managing search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermExclusion, setSearchTermExclusion] = useState("");
  const [searchTermTransfer, setSearchTermTransfer] = useState("");
  const [searchTermOtherInformation, setSearchTermOtherInformation] =
    useState("");
  const [searchTermHotel, setSearchTermHotel] = useState("");
  const [searchTermActivity, setSearchTermActivity] = useState("");

  // State for active day (the one that is being edited/viewed)
  const [activeDay, setActiveDay] = useState(1);
  const [activeDayActivity, setActiveDayActivity] = useState(1);

  // const [place, setPlace] = useState(""); // Store user's place input
  const [location, setLocation] = useState(null); // Store geocoded location
  const [error, setError] = useState(null); // Handle errors

  const geocodePlace = async () => {
    axios
      .get(`${serverUrl}/search-hotel/?hotelName=${searchTermHotel}`)
      .then((response) => {
        console.log(response);
        setAllHotel(response.data);
        setOriginalHotel(response.data);
      })
      .catch((error) => {
        console.log(error);
        setError("Error fetching hotels");
      });
    // const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchTermHotel}&key=AIzaSyBSDhdL2tinLiAKRk7w9JhDAv5gAQXFMIk`;

    // try {
    //   // Override withCredentials for this specific request
    //   const response = await axios.get(geocodeUrl, {
    //     withCredentials: false, // Disable withCredentials for this request
    //   });

    //   const results = response.data.results;
    //   console.log(response);
    //   if (results.length > 0) {
    //     const { lat, lng } = results[0].geometry.location;
    //     setLocation(`${lat},${lng}`);
    //   } else {
    //     setError("Place not found");
    //   }
    // } catch (error) {
    //   setError("Error geocoding place");
    // }
  };

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

  const addActivityDay = () => {
    const newDay = activityPerDay.length + 1;
    setActivityPerDay([
      ...activityPerDay,
      {
        day: newDay,
        summaryDetails: { title: "", description: [""] },
        isSaved: false,
      },
    ]);
    setActiveDayActivity(newDay);
  };

  // Handle selecting a travel summary from the list
  const handleSelectSummary = (summary) => {
    const updatedSummaries = [...travelSummaryPerDay];
    const dayIndex = activeDay - 1; // Correct day index for updating the specific day
    updatedSummaries[dayIndex].summaryDetails = summary;
    setTravelSummaryPerDay(updatedSummaries);
  };

  const handleSelectActivity = (summary) => {
    const updatedActivities = [...activityPerDay];
    console.log(summary);
    const dayIndex = activeDayActivity - 1; // Get current active day

    // Update the selected day's summary with the new summary from the API
    updatedActivities[dayIndex].summaryDetails = {
      ...updatedActivities[dayIndex].summaryDetails,
      title: summary.title,
      description: summary.description, // Array of descriptions
      images: summary.images,
    };

    setActivityPerDay(updatedActivities);
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

  const deleteActivityDay = (dayIndex) => {
    const updatedActivity = activityPerDay.filter(
      (summary, index) => index !== dayIndex
    );

    // Update the day values for each remaining summary
    const reindexedActivities = updatedActivity.map((summary, index) => ({
      ...summary,
      day: index + 1, // Reassign day number sequentially
    }));

    setActivityPerDay(reindexedActivities);

    // Set the active day to a valid day after deletion, default to day 1
    setActiveDay(
      reindexedActivities.length > 0 ? reindexedActivities[0].day : 1
    );
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

    axios.get(`${serverUrl}/api/inclusion/inclusions/`).then((res) => {
      console.log("keknef");
      setAllInclusion(res.data.data);
      setOriginalInclusion(res.data.data); // Store original data
    });

    axios
      .get(`${serverUrl}/api/other-information/other-information/`)
      .then((res) => {
        // console.log(res)
        setAllOtherInformation(res.data.data);
        setOriginalOtherInformation(res.data.data); // Store original data
      });

    axios.get(`${serverUrl}/api/activity/all`).then((res) => {
      setAllActivityData(res.data.data);
      setOriginalActivityData(res.data.data); // Store original data
    });
  }, []);

  // useEffect(() => {
  //   if (location) {
  //     axios
  //       .get(`${serverUrl}/hotels?location=${location}&name=${name}`)
  //       .then((response) => {
  //         console.log(response)
  //         setAllHotel(response.data);
  //         setOriginalHotel(response.data);
  //       })
  //       .catch((error) => {
  //         console.log(error)
  //         setError("Error fetching hotels");
  //       });
  //   }
  // }, [location,name]);

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
        toast.error(err.response.data.message);
      });
  };

  const handleSearchActivity = (e) => {
    e.preventDefault();
    axios
      .get(`${serverUrl}/api/activity/search/?keyword=${searchTermActivity}`)
      .then((res) => {
        console.log(res);
        setAllActivityData(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
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
        toast.error(err.response.data.message);
      });
  };

  const handleSelectExclusion = (exclusion) => {
    setSelectedExclusions((prev) => [...prev, exclusion]); // Add to array
    resetSearchExclusion(); // Reset search
  };

  const handleSearchHotel = (e) => {
    e.preventDefault();
    // console.log(searchTermHotel,name)
    if (searchTermHotel) {
      geocodePlace(); // Convert place to lat/lng before fetching hotels
    } else {
      setError("Please enter a place name");
    }
  };

  const handleSelectHotel = (hotel) => {
    setSelectedHotel((prev) => [
      ...prev,
      {
        ...hotel, // Add hotel details (name, vicinity, rating)
        checkInDate: "", // Initialize input fields
        checkOutDate: "",
        mealPlan: "",
        numberOfGuest: "",
        roomType: "",
      },
    ]);
    resetSearchHotel(); // Reset search
  };

  const handleSearchTransfer = (e) => {
    e.preventDefault();
    axios
      .get(`${serverUrl}/api/transfer/search/?keywords=${searchTermTransfer}`)
      .then((res) => {
        setAllTransfer(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleSelectTransfer = (transfer) => {
    setSelectedTransfer((prev) => [...prev, transfer]);
    resetSearchTransfer(); // Reset search
  };

  const handleSearchOtherInformation = (e) => {
    e.preventDefault();
    axios
      .get(
        `${serverUrl}/api/other-information/search/?keywords=${searchTermOtherInformation}`
      )
      .then((res) => {
        setAllOtherInformation(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleSelectOtherinformation = (transfer) => {
    setSelectedOtherInformation((prev) => [...prev, transfer]);
    resetSearchOtherinformation(); // Reset search
  };

  const handleInputChangeExclusion = (e, index) => {
    const { name, value } = e.target;
    setSelectedExclusions((prev) =>
      prev.map((exclusion, i) =>
        i === index ? { ...exclusion, [name]: value } : exclusion
      )
    );
  };

  const handleRemoveExclusion = (index) => {
    setSelectedExclusions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChangeHotel = (e, index) => {
    const { name, value } = e.target;
    setSelectedHotel((prev) =>
      prev.map((hotel, i) =>
        i === index ? { ...hotel, [name]: value } : hotel
      )
    );
  };

  const handleRemoveHotel = (index) => {
    setSelectedHotel((prev) => prev.filter((_, i) => i !== index));
  };

  const handleManualHotelChange = (e) => {
    const { name, value } = e.target;
    setManualHotel((prev) => ({ ...prev, [name]: value }));
  };

  // Add manually entered hotel to the selectedHotel array
  const handleAddManualHotel = (e) => {
    e.preventDefault();
    setSelectedHotel((prev) => [...prev, manualHotel]);
    setShowManualForm(false); // Close the manual entry form
    setManualHotel({
      name: "",
      formatted_address: "",
      rating: "",
      checkInDate: "",
      checkOutDate: "",
      mealPlan: "",
      numberOfGuest: "",
      roomType: "",
    });
  };

  const handleInputChangeTransfer = (e, index) => {
    const { name, value } = e.target;
    setSelectedTransfer((prev) =>
      prev.map((transfer, i) =>
        i === index ? { ...transfer, [name]: value } : transfer
      )
    );
  };

  const handleRemoveTransfer = (index) => {
    setSelectedTransfer((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChangeOtherinformation = (e, index) => {
    const { name, value } = e.target;
    setSelectedOtherInformation((prev) =>
      prev.map((other, i) =>
        i === index ? { ...other, [name]: value } : other
      )
    );
  };

  const handleRemoveOther = (index) => {
    setSelectedOtherInformation((prev) => prev.filter((_, i) => i !== index));
  };

  const resetSearch = () => {
    setSearchTerm(""); // Clear the search term
    setAllTravelData(originalTravelData); // Reset to original data
  };

  const resetSearchActivity = () => {
    setSearchTermActivity(""); // Clear the search term
    setAllActivityData(originalActivityData); // Reset to original data
  };

  const resetSearchExclusion = () => {
    setSearchTermExclusion(""); // Clear search term
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

  const resetSearchHotel = () => {
    setSearchTermHotel(""); // Clear the search term
    setAllHotel(originalHotel); // Reset to original data
  };

  const resetName = () => {
    setName("");
    setAllHotel(originalHotel);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const calculateTotal = () => {
    return (
      data?.numberOfAdultTravellers * adultPrice +
      data?.numberChildTravellers * childPrice
    );
  };

  // Function to update the price details in the desired format
  const updatePriceDetails = () => {
    const adultCount = data?.numberOfAdultTravellers;
    const childCount = data?.numberChildTravellers;

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

  // inclusion extra --------------

  const handleSearchInclusion = (e) => {
    e.preventDefault();
    axios
      .get(`${serverUrl}/api/inclusion/search/?keywords=${searchTermInclusion}`)
      .then((res) => {
        setAllInclusion(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleSelectInclusion = (inclusion) => {
    setSelectedInclusions((prev) => [...prev, inclusion]); // Add to array
    resetSearchInclusion(); // Reset search
  };
  const handleInputChangeInclusion = (e, inclusionIndex, descriptionIndex) => {
    const { name, value } = e.target;
    setSelectedInclusions((prev) =>
      prev.map((inclusion, i) =>
        i === inclusionIndex
          ? {
              ...inclusion,
              [name]:
                name === "title"
                  ? value
                  : inclusion.description.map((desc, j) =>
                      j === descriptionIndex ? value : desc
                    ),
            }
          : inclusion
      )
    );
  };
  const handleRemoveInclusion = (index) => {
    setSelectedInclusions((prev) => prev.filter((_, i) => i !== index));
  };

  const resetSearchInclusion = () => {
    setSearchTermInclusion(""); // Clear search term
    setAllInclusion(originalInclusion); // Reset to original data
  };

  const handleRemoveDescription = (inclusionIndex, descriptionIndex) => {
    setSelectedInclusions((prev) =>
      prev.map((inclusion, i) =>
        i === inclusionIndex
          ? {
              ...inclusion,
              description: inclusion.description.filter(
                (_, j) => j !== descriptionIndex
              ),
            }
          : inclusion
      )
    );
  };

  // console.log(data);

  const handleFinalSubmit = () => {
    // Send the POST request with your itinerary data
    console.log({
      quote: data,
      destinationOnly: data?.destination,
      travelSummaryPerDay,
      activityPerDay,
      priceDetails,
      selectedHotel,
      selectedExclusions,
      selectedOtherInformation,
      selectedTransfers,
      selectedInclusions,
    });
    setLoadingItinery(true);
    axios
      .post(
        `${serverUrl}/api/quote/itenerary/generate`,
        {
          quote: data,
          destinationOnly: data?.destination,
          travelSummaryPerDay,
          activityPerDay,
          priceDetails,
          selectedHotel,
          selectedExclusions,
          selectedOtherInformation,
          selectedTransfers,
          selectedInclusions,
        },
        {
          responseType: "blob", // Important: To receive the PDF as binary data (Blob)
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setLoadingItinery(false);
        console.log(res);
        // Create a new Blob object using the response data (PDF binary)
        const file = new Blob([res.data], { type: "application/pdf" });

        // Create a temporary URL for the Blob
        const fileURL = URL.createObjectURL(file);

        // Create an anchor element and set the href to the file URL
        const link = document.createElement("a");
        link.href = fileURL;

        // Set the file name for the download
        link.download = "itinerary.pdf";

        // Append the link to the body
        document.body.appendChild(link);

        // Programmatically trigger the click to start downloading the PDF
        link.click();

        // Remove the link after downloading
        document.body.removeChild(link);
      })
      .catch((error) => {
        setLoadingItinery(false);
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

  // console.log(data);

  return (
    <div className="flex gap-5">
      <div className="w-[100%] m-auto mt-3 rounded-md p-4">
      <div className="relative w-full">
          {/* Background Image with dark overlay */}
          <div
            className="inset-0 bg-cover bg-center rounded-md relative"
            style={{
              backgroundImage: 'url("/img/lanscape2.jpg")',
              height: "200px", // Adjust height as needed
            }}
          >
            {/* Dark Overlay on the background image */}
            <div className="absolute inset-0 bg-black opacity-50 rounded-md pointer-events-none"></div>
            <div className="absolute inset-0 flex flex-col p-4 pb-0 justify-between z-10">
              <div className="text-3xl text-white font-semibold">
                Create itinerary
              </div>
            </div>
          </div>
        </div>
        <Card className="overflow-hidden mt-5">
          <div
            className="w-[70px] border-b cursor-pointer hover:border-b-blue text-maincolor2 m-3 ml-8"
            onClick={() => window.history.back()}
          >
            Go back
          </div>
          <div className="p-8 pt-2 pb-0 flex justify-between">
            <div className="w-[50%] text-xl text-semibold">
              <span className="px-4 py-2 rounded-md text-sm text-white bg-green-500">
                Active
              </span>{" "}
              {tripid}
            </div>
            <div className="flex justify-center items-center">
              <Button
                className={`bg-main m-auto ${
                  loadingItinery ? "cursor-not-allowed opacity-75" : ""
                }`}
                onClick={handleFinalSubmit}
                disabled={loadingItinery}
              >
                {loadingItinery ? (
                  <span className="flex items-center gap-2">
                    <FaSpinner className="animate-spin" /> Generating pdf...
                  </span>
                ) : (
                  "Final Submit"
                )}
              </Button>
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
              <div
                className={`${
                  selectedCategory === "Cost (Adult, child)"
                    ? "w-[80%]"
                    : "w-[50%]"
                }  bg-white p-4 rounded-lg col-span-2`}
              >
                {selectedCategory === "Travel Summary" && (
                  <>
                    <div className="flex justify-between bg-white rounded-lg gap-5">
                      <div className="w-[80%] grid grid-cols-4 gap-2 border-gray-300">
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
                      {travelSummaryPerDay?.length < data?.duration ? (
                        <div className="w-[20%]">
                          <div
                            onClick={addTravelSummaryDay}
                            className="cursor-pointer text-center border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-2 py-1 rounded "
                          >
                            New day
                          </div>
                          {/* <ul className="w-[150px] absolute right-0 shadow text-center hidden bg-white border rounded p-2 text-gray-700 group-hover:block z-10">
                            <li className="flex justify-center items-center gap-2 w-full text-xs font-semibold">
                              <FiInfo className="font-bold" /> Add New day
                            </li>
                          </ul> */}
                        </div>
                      ) : null}
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

                {selectedCategory === "Activity" && (
                  <>
                    <div className="flex justify-between bg-white rounded-lg gap-5">
                      <div className="w-[80%] grid grid-cols-4 gap-2 border-gray-300">
                        {activityPerDay?.map((daySummary, index) => (
                          <div
                            key={index}
                            className={`w-[80px] h-[30px] flex justify-between items-center rounded cursor-pointer text-center py-1 px-2 text-sm ${
                              activeDayActivity === daySummary.day
                                ? "border border-main bg-main text-white"
                                : "border border-main text-main"
                            }`}
                            onClick={() => setActiveDayActivity(daySummary.day)}
                          >
                            Day {daySummary.day}{" "}
                            <AiOutlineClose
                              className={`cursor-pointer text-sm hover:bg-main hover:text-white rounded-[50%] p-1 ${
                                activeDayActivity === daySummary.day
                                  ? "text-white"
                                  : "text-main"
                              }`}
                              size={16}
                              onClick={() => deleteActivityDay(index)}
                            />
                          </div>
                        ))}
                      </div>
                      {activityPerDay?.length < data?.duration ? (
                        <div className="w-[20%]">
                          <div
                            onClick={addActivityDay}
                            className="cursor-pointer text-center border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-2 py-1 rounded "
                          >
                            New day
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {activityPerDay.map((daySummary, index) =>
                      activeDayActivity === daySummary.day ? (
                        <div key={index} className="mb-4">
                          <div className="mt-5 mb-5 text-lg font-normal">
                            Day {daySummary.day}
                          </div>

                          <div className="flex flex-col gap-4 mt-4">
                            {/* Title Input */}
                            <Input
                              label={`Title`}
                              value={daySummary.summaryDetails.title}
                              placeholder="Edit travel summary title"
                              onChange={(e) => {
                                const updatedSummaries = [...activityPerDay];
                                updatedSummaries[index].summaryDetails.title =
                                  e.target.value;
                                setActivityPerDay(updatedSummaries);
                              }}
                            />

                            {/* Dynamically Render Input Boxes for Each Description */}
                            {daySummary.summaryDetails.description.map(
                              (desc, descIndex) => (
                                <Textarea
                                  key={descIndex}
                                  label={`Description ${descIndex + 1}`}
                                  value={desc}
                                  className="min-h-[50px] h-auto"
                                  onChange={(e) => {
                                    const updatedSummaries = [
                                      ...activityPerDay,
                                    ];
                                    updatedSummaries[
                                      index
                                    ].summaryDetails.description[descIndex] =
                                      e.target.value; // Update specific description
                                    setActivityPerDay(updatedSummaries);
                                  }}
                                />
                              )
                            )}
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
                    <div className="flex flex-col w-full gap-5">
                      {selectedExclusions.map((exclusion, index) => (
                        <div
                          key={index}
                          className="flex justify-between gap-4 p-4 rounded"
                          style={{
                            "box-shadow": "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                          }}
                        >
                          <div className="w-[95%]">
                            <Input
                              label={`Title ${index + 1}`}
                              name="title"
                              value={exclusion.title}
                              onChange={(e) =>
                                handleInputChangeExclusion(e, index)
                              }
                            />
                            <div className="mt-5">
                              <Textarea
                                label={`Description ${index + 1}`}
                                name="description"
                                value={exclusion.description}
                                onChange={(e) =>
                                  handleInputChangeExclusion(e, index)
                                }
                                className="min-h-[50px] h-auto w-full "
                              />
                            </div>
                          </div>
                          <div className="w-[5%]">
                            <button
                              className=" text-main"
                              onClick={() => handleRemoveExclusion(index)}
                            >
                              <IoMdClose size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {selectedCategory === "Transfers" && (
                  <>
                    <div className="mt-5 mb-5 text-lg font-normal">
                      Transfer details
                    </div>
                    <div className="flex flex-col w-full gap-5">
                      {selectedTransfers.map((trnsfer, index) => (
                        <div
                          key={index}
                          className="flex justify-between gap-4 p-4 rounded"
                          style={{
                            "box-shadow": "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                          }}
                        >
                          <div className="w-[95%]">
                            <Input
                              label={`Title ${index + 1}`}
                              value={trnsfer.title}
                              name="title"
                              onChange={(e) =>
                                handleInputChangeTransfer(e, index)
                              }
                            />
                            <div className="mt-5">
                              <Textarea
                                label={`Description ${index + 1}`}
                                name="description"
                                value={trnsfer.description}
                                className="min-h-[50px] h-auto w-full" // Adjusted to 100% width
                                onChange={(e) =>
                                  handleInputChangeTransfer(e, index)
                                }
                              />
                            </div>
                          </div>
                          <div className="w-[5%]">
                            <button
                              className=" text-main"
                              onClick={() => handleRemoveTransfer(index)}
                            >
                              <IoMdClose size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {selectedCategory === "Other Information" && (
                  <>
                    <div className="mt-5 mb-5 text-lg font-normal">
                      Other information details
                    </div>
                    <div className="flex flex-col w-full gap-5">
                      {selectedOtherInformation.map((other, index) => {
                        return (
                          <div
                            key={index}
                            className="flex justify-between gap-4 p-4 rounded"
                            style={{
                              "box-shadow":
                                "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                            }}
                          >
                            <div className="w-[95%]">
                              <Input
                                label={`Title ${index + 1}`}
                                value={other?.title}
                                name="title"
                                onChange={(e) =>
                                  handleInputChangeOtherinformation(e, index)
                                }
                              />
                              <div className="mt-5">
                                <Textarea
                                  label={`Description ${index + 1}`}
                                  name="description"
                                  value={other?.description}
                                  className="min-h-[50px] h-auto w-full" // Adjusted to 100% width
                                  onChange={(e) =>
                                    handleInputChangeOtherinformation(e, index)
                                  }
                                />
                              </div>
                            </div>
                            <div className="w-[5%]">
                              <button
                                className=" text-main"
                                onClick={() => handleRemoveOther(index)}
                              >
                                <IoMdClose size={20} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {selectedCategory === "Cost (Adult, child)" && (
                  <div className="mt-2 mb-2 text-lg font-normal">
                    Cost (Adult, child) details
                    <div className="p-5">
                      <h2 className="text-lg font-bold mb-4">
                        {data?.numberOfAdultTravellers} Adults and{" "}
                        {data?.numberChildTravellers} Child
                      </h2>

                      <div className="flex justify-between items-center mb-2 gap-5">
                        <Input
                          type="number"
                          label="Adult Price"
                          value={adultPrice}
                          onChange={(e) =>
                            setAdultPrice(Number(e.target.value))
                          }
                          placeholder="Set adult price"
                        />
                        <Input
                          type="number"
                          label="Child Price"
                          value={childPrice}
                          onChange={(e) =>
                            setChildPrice(Number(e.target.value))
                          }
                          placeholder="Set child price"
                        />
                      </div>

                      <div className="border border-gray-300 p-4 rounded-md mt-4 flex justify-start items-center gap-2">
                        <h3 className="font-semibold">Total Cost :</h3>
                        <p className="text-xl font-bold">
                          Rs. {calculateTotal()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedCategory === "Hotel details" && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="mt-5 mb-5 text-lg font-normal">
                        Hotel details
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowManualForm((prev) => !prev)}
                        className="px-4 py-2 bg-main text-sm text-white rounded-md"
                      >
                        Add Manually
                      </button>
                    </div>
                    {/* modal ------------ */}
                    {showManualForm && (
                      <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
                        <div className="sidebar relative m-4 w-[40%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-8">
                          <div className="flex items-center justify-between p-4 font-sans text-2xl font-semibold text-blue-gray-900">
                            Add hotel manually
                            <AiOutlineClose
                              className="cursor-pointer"
                              size={24}
                              onClick={() => setShowManualForm(false)}
                            />
                          </div>
                          <div className="px-4">
                            <form
                              onSubmit={handleAddManualHotel}
                              className="mt-4 rounded-md"
                            >
                              <div>
                                <Input
                                  type="text"
                                  name="name"
                                  label="Hotel Name"
                                  value={manualHotel.name}
                                  onChange={handleManualHotelChange}
                                  className="w-full px-4 py-2 mb-2 border rounded-md"
                                  required
                                />
                              </div>
                              <div className="mt-5">
                                <Input
                                  type="text"
                                  name="formatted_address"
                                  label="Address"
                                  value={manualHotel.formatted_address}
                                  onChange={handleManualHotelChange}
                                  className="w-full px-4 py-2 mb-2 border rounded-md"
                                  required
                                />
                              </div>
                              <div className="mt-5 flex justify-between gap-5">
                                <Input
                                  type="text"
                                  name="mealPlan"
                                  label="Meal Plan"
                                  value={manualHotel.mealPlan}
                                  onChange={handleManualHotelChange}
                                  required
                                  className="w-full px-4 py-2 mb-2 border rounded-md"
                                />
                                <Input
                                  type="number"
                                  name="rating"
                                  label="Rating"
                                  value={manualHotel.rating}
                                  onChange={handleManualHotelChange}
                                  className="w-full px-4 py-2 mb-2 border rounded-md"
                                />
                              </div>
                              <div className="mt-5 flex justify-between gap-5">
                                <Input
                                  type="date"
                                  name="checkInDate"
                                  label="Check-in Date"
                                  value={manualHotel.checkInDate}
                                  onChange={handleManualHotelChange}
                                  required
                                  className="w-full px-4 py-2 mb-2 border rounded-md"
                                />
                                <Input
                                  type="date"
                                  name="checkOutDate"
                                  label="Check-out Date"
                                  value={manualHotel.checkOutDate}
                                  onChange={handleManualHotelChange}
                                  required
                                  className="w-full px-4 py-2 mb-2 border rounded-md"
                                />
                              </div>

                              <div className="mt-5 flex justify-between gap-5">
                                <Input
                                  type="number"
                                  name="numberOfGuest"
                                  label="Number of Guests"
                                  value={manualHotel.numberOfGuest}
                                  onChange={handleManualHotelChange}
                                  required
                                  className="w-full px-4 py-2 mb-2 border rounded-md"
                                />
                                <Input
                                  type="text"
                                  name="roomType"
                                  label="Room Type"
                                  value={manualHotel.roomType}
                                  onChange={handleManualHotelChange}
                                  required
                                  className="w-full px-4 py-2 mb-2 border rounded-md"
                                />
                              </div>
                              <div className="flex justify-center items-center">
                                <button
                                  type="submit"
                                  className="w-1/5 px-4 py-2  mt-5 bg-main text-white rounded-md "
                                >
                                  Add Hotel
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* modal ---------- */}
                    <div className="flex flex-col w-full gap-5">
                      {selectedHotel.map((hotel, index) => {
                        return (
                          <div
                            key={index}
                            className={`flex justify-between gap-4 rounded p-4 ${
                              index == 0 ? "mt-0" : "mt-3"
                            }`}
                            style={{
                              "box-shadow":
                                "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                            }}
                          >
                            <div className="w-[95%]">
                              {/* Hotel Info */}
                              <div>
                                <div className="font-semibold">
                                  {hotel?.name}
                                </div>
                                <div className="mt-1 text-sm">
                                  {hotel?.formatted_address}
                                </div>
                                <div className="flex justify-start items-center gap-2 text-sm">
                                  <FaStar />
                                  {hotel?.rating}
                                </div>
                              </div>

                              <div className="w-[100%] flex justify-between items-center gap-3 mt-5">
                                <label
                                  htmlFor={`'checkin'${index}`}
                                  className="w-[48%] cursor-pointer text-sm font-semibold"
                                >
                                  Check in
                                </label>

                                <label
                                  htmlFor={`'checkout'${index}`}
                                  className="w-[48%] cursor-pointer text-sm font-semibold"
                                >
                                  Check out
                                </label>
                              </div>
                              {/* Input Fields */}
                              <div className="w-[100%] flex justify-between items-center gap-3 mt-1">
                                <input
                                  label="Check-in"
                                  type="date"
                                  name="checkInDate"
                                  value={hotel.checkInDate}
                                  placeholder="whdhw"
                                  onChange={(e) =>
                                    handleInputChangeHotel(e, index)
                                  }
                                  id={`'checkin'${index}`}
                                  className="w-[48%] px-4 py-2 border rounded-md"
                                />

                                <input
                                  label="Check-out"
                                  type="date"
                                  name="checkOutDate"
                                  value={hotel.checkOutDate}
                                  onChange={(e) =>
                                    handleInputChangeHotel(e, index)
                                  }
                                  id={`'checkout'${index}`}
                                  className="w-[48%] px-4 py-2 border rounded-md"
                                />
                              </div>
                              <div className="w-[100%] flex justify-between items-center gap-3 mt-5">
                                <label
                                  htmlFor={`'Mealplan'${index}`}
                                  className="w-[30%] cursor-pointer text-sm font-semibold"
                                >
                                  Meal plan
                                </label>

                                <label
                                  htmlFor={`'Noguest'${index}`}
                                  className="w-[30%] cursor-pointer text-sm font-semibold"
                                >
                                  No. of guest
                                </label>
                                <label
                                  htmlFor={`'Roomtype'${index}`}
                                  className="w-[30%] cursor-pointer text-sm font-semibold"
                                >
                                  Room type
                                </label>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <input
                                  label="Meal plan"
                                  name="mealPlan"
                                  value={hotel.mealPlan}
                                  onChange={(e) =>
                                    handleInputChangeHotel(e, index)
                                  }
                                  id={`'Mealplan'${index}`}
                                  className="w-[30%] px-4 py-2 border rounded-md"
                                  placeholder="Meal plan"
                                />
                                <input
                                  label={`No. of guest`}
                                  id={`'Noguest'${index}`}
                                  name="numberOfGuest"
                                  value={hotel.numberOfGuest}
                                  onChange={(e) =>
                                    handleInputChangeHotel(e, index)
                                  }
                                  className="w-[30%] px-4 py-2 border rounded-md"
                                  placeholder="No. of guest"
                                  type="number"
                                />
                                <input
                                  label={`Room type`}
                                  id={`'Roomtype'${index}`}
                                  name="roomType"
                                  value={hotel.roomType}
                                  onChange={(e) =>
                                    handleInputChangeHotel(e, index)
                                  }
                                  className="w-[30%] px-4 py-2 border rounded-md"
                                  placeholder="Room type"
                                />
                              </div>
                            </div>

                            {/* Remove Button */}
                            <div className="w-[5%]">
                              <button
                                className="text-main"
                                onClick={() => handleRemoveHotel(index)}
                              >
                                <IoMdClose size={20} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {selectedCategory === "Inclusion" && (
                  <>
                    <div className="mt-5 mb-5 text-lg font-normal">
                      Inclusion details
                    </div>
                    <div className="flex flex-col w-full gap-5">
                      {selectedInclusions.map((inclusion, inclusionIndex) => (
                        <div
                          key={inclusionIndex}
                          className="flex justify-between gap-4 p-4 rounded"
                          style={{
                            "box-shadow": "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                          }}
                        >
                          <div className="w-[95%]">
                            <Input
                              label={`Title ${inclusionIndex + 1}`}
                              name="title"
                              value={inclusion.title}
                              onChange={(e) =>
                                handleInputChangeInclusion(e, inclusionIndex)
                              }
                            />
                            <div className="mt-5">
                              {inclusion.description.map(
                                (desc, descriptionIndex) => (
                                  <div
                                    key={descriptionIndex}
                                    className="flex items-center gap-2"
                                  >
                                    <Textarea
                                      label={`Point ${descriptionIndex + 1}`}
                                      name="description"
                                      value={desc}
                                      onChange={(e) =>
                                        handleInputChangeInclusion(
                                          e,
                                          inclusionIndex,
                                          descriptionIndex
                                        )
                                      }
                                    />
                                    <LuMinus
                                      className="text-main cursor-pointer"
                                      onClick={() =>
                                        handleRemoveDescription(
                                          inclusionIndex,
                                          descriptionIndex
                                        )
                                      }
                                    />
                                    {/* <Button
                                      type="button"
                                      
                                      className="p-1 text-red-500 hover:text-red-700"
                                    >
                                      Delete
                                    </Button> */}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                          <div className="w-[5%]">
                            <button
                              className="text-main"
                              onClick={() =>
                                handleRemoveInclusion(inclusionIndex)
                              }
                            >
                              <IoMdClose size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
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
                        allTravelData?.map((summary, index) => (
                          <div
                            key={index}
                            className="py-2 px-2 hover:bg-gray-200 transition-colors cursor-pointer"
                            onClick={() => {
                              handleSelectSummary(summary, 0);
                              resetSearch();
                            }}
                          >
                            <div className="font-bold">
                              {summary.title.length <= 20
                                ? summary.title
                                : summary.title.slice(0, 20) + "..."}
                            </div>
                            <div className="text-gray-600">
                              {summary.description.length <= 30
                                ? summary.description
                                : summary.description.slice(0, 30) + "..."}
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

              {selectedCategory === "Activity" && (
                <div className="w-[30%] h-[400px]  bg-gray-100 p-4 rounded-lg shadow-md flex flex-col">
                  <form
                    onSubmit={handleSearchActivity}
                    className="mb-4 flex justify-between items-center gap-2"
                  >
                    <div className="relative w-[85%]">
                      <Input
                        label="Search activities"
                        className="w-full"
                        value={searchTermActivity}
                        onChange={(e) => setSearchTermActivity(e.target.value)}
                        required
                      />
                      {/* Cross icon to clear the search */}
                      {searchTermActivity && (
                        <button
                          type="button"
                          onClick={resetSearchActivity}
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
                      {allActivityData?.length > 0 ? (
                        allActivityData?.map((summary, index) => (
                          <div
                            key={index}
                            className="py-2 px-2 hover:bg-gray-200 transition-colors cursor-pointer"
                            onClick={() => {
                              handleSelectActivity(summary, 0);
                              resetSearchActivity();
                            }}
                          >
                            <div className="font-bold">
                              {" "}
                              {summary.title.length <= 20
                                ? summary.title
                                : summary.title.slice(0, 20) + "..."}
                            </div>
                            <div className="text-gray-600">
                              {summary?.description
                                ?.slice(0, 2)
                                .map((el, index) => (
                                  <span key={index}>
                                    {el.length <= 20
                                      ? el
                                      : el.slice(0, 20) + "..."}
                                    {index < 1 &&
                                    summary?.description?.length >= 2
                                      ? ", "
                                      : ""}
                                  </span>
                                ))}
                              {summary?.description?.length > 2 && (
                                <span>
                                  {" "}
                                  and {summary?.description?.length - 2} more
                                </span>
                              )}
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
                <div className="w-[30%] h-[400px] bg-gray-100 p-4 rounded-lg shadow-md flex flex-col">
                  {/* Search Form */}
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
                          &times;
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

                  {/* Exclusion List */}
                  <div className="flex-1 overflow-y-auto sidebar">
                    <List className="border-t border-gray-300">
                      {allExclusion?.length > 0 ? (
                        allExclusion.map((summary, index) => (
                          <div
                            key={index}
                            className="py-2 px-2 hover:bg-gray-200 transition-colors cursor-pointer"
                            onClick={() => handleSelectExclusion(summary)} // Add to multiple selections
                          >
                            <div className="font-bold">
                              {summary.title.length <= 20
                                ? summary.title
                                : summary.title.slice(0, 20) + "..."}
                            </div>
                            <div className="text-gray-600">
                              {summary.description.length <= 30
                                ? summary.description
                                : summary.description.slice(0, 30) + "..."}
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
                            onClick={() => handleSelectTransfer(summary)}
                          >
                            <div className="font-bold">
                              {summary.title.length <= 20
                                ? summary.title
                                : summary.title.slice(0, 20) + "..."}
                            </div>
                            <div className="text-gray-600">
                              {summary.description.length <= 30
                                ? summary.description
                                : summary.description.slice(0, 30) + "..."}
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
                        onChange={(e) =>
                          setSearchTermOtherInformation(e.target.value)
                        }
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
                            onClick={() =>
                              handleSelectOtherinformation(summary)
                            }
                          >
                            <div className="font-bold">
                              {summary.title.length <= 20
                                ? summary.title
                                : summary.title.slice(0, 20) + "..."}
                            </div>
                            <div className="text-gray-600">
                              {summary.description.length <= 30
                                ? summary.description
                                : summary.description.slice(0, 30) + "..."}
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

              {selectedCategory === "Hotel details" && (
                <div className="w-[30%] h-[400px] bg-gray-100 p-4 rounded-lg shadow-md flex flex-col">
                  <form
                    onSubmit={handleSearchHotel}
                    className="mb-4 flex justify-between gap-2"
                  >
                    <div className="relative w-[85%]">
                      <Input
                        label="Enter location"
                        className="w-full"
                        value={searchTermHotel}
                        onChange={(e) => setSearchTermHotel(e.target.value)}
                        required
                      />
                      {searchTermHotel && (
                        <button
                          type="button"
                          onClick={resetSearchHotel}
                          className="absolute right-2 top-5 transform -translate-y-1/2 text-gray-600"
                        >
                          &times;
                        </button>
                      )}
                      {name && (
                        <button
                          type="button"
                          onClick={resetName}
                          className="absolute right-2 top-16 transform -translate-y-1/2 text-gray-600"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-[15%] h-[40px] bg-main px-2 py-2 text-xl text-white cursor-pointer rounded flex justify-center items-center"
                    >
                      <IoMdSearch />
                    </button>
                  </form>

                  {/* Hotel List */}
                  <div className="flex-1 overflow-y-auto sidebar">
                    <List className="border-t border-gray-300">
                      {allHotel?.length > 0 ? (
                        allHotel.map((summary, index) => (
                          <div
                            key={index}
                            className="py-2 px-2 hover:bg-gray-200 transition-colors cursor-pointer"
                            onClick={() => handleSelectHotel(summary)}
                          >
                            <div className="font-bold">{summary.name}</div>
                            <div className="text-gray-600 text-sm">
                              {summary.formatted_address}
                            </div>
                            <div className="text-gray-600 text-sm flex justify-start items-center gap-2">
                              <FaStar />
                              <span className="">{summary.rating}</span>
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

              {selectedCategory === "Inclusion" && (
                <div className="w-[30%] h-[400px] bg-gray-100 p-4 rounded-lg shadow-md flex flex-col">
                  {/* Search Form */}
                  <form
                    onSubmit={handleSearchInclusion}
                    className="mb-4 flex justify-between items-center gap-2"
                  >
                    <div className="relative w-[85%]">
                      <Input
                        label="Search inclusions"
                        className="w-full"
                        value={searchTermInclusion}
                        onChange={(e) => setSearchTermInclusion(e.target.value)}
                        required
                      />
                      {/* Cross icon to clear the search */}
                      {searchTermInclusion && (
                        <button
                          type="button"
                          onClick={resetSearchInclusion}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                        >
                          &times;
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

                  {/* Inclusion List */}
                  <div className="flex-1 overflow-y-auto sidebar">
                    <List className="border-t border-gray-300">
                      {allInclusion?.length > 0 ? (
                        allInclusion.map((summary, index) => (
                          <div
                            key={index}
                            className="py-2 px-2 hover:bg-gray-200 transition-colors cursor-pointer"
                            onClick={() => handleSelectInclusion(summary)} // Add to multiple selections
                          >
                            <div className="font-bold">
                              {summary.title.length <= 20
                                ? summary.title
                                : summary.title.slice(0, 20) + "..."}
                            </div>
                            <div className="text-gray-600">
                              {summary?.description
                                ?.slice(0, 2)
                                .map((el, index) => (
                                  <span key={index}>
                                    {el.length <= 30
                                      ? el
                                      : el.slice(0, 30) + "..."}
                                    {index < 1 &&
                                    summary?.description?.length >= 2
                                      ? ", "
                                      : ""}
                                  </span>
                                ))}
                              {summary?.description?.length > 2 && (
                                <span>
                                  {" "}
                                  and {summary?.description?.length - 2} more
                                </span>
                              )}
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

              {/* <div className="mt-4 p-4 border">
    <h2 className="text-xl font-bold">Submitted Data</h2>
    <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded">
      {JSON.stringify({
      travelSummaryPerDay,
      activityPerDay,
      priceDetails,
      selectedHotel,
      selectedExclusions,
      selectedOtherInformation,
      selectedTransfers,
      selectedInclusions
    }, null, 2)}
    </pre>
  </div> */}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CreateItinerary;
