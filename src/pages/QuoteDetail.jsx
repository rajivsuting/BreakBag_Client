import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Button, Input, Textarea } from "@material-tailwind/react";
import { MdDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";
import { LuPlusCircle } from "react-icons/lu";

import {
  Card,
  CardBody,
  Typography,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import AddActivities from "../components/AddActivities";
import { serverUrl } from "../api";
import axios from "axios";
import AddDestination from "../components/AddDestination";
import { Link, useParams } from "react-router-dom";
import { convertDate } from "../Utils/Dateformat";

const data = [
  {
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Editor",
    status: "Inactive",
  },
  {
    name: "Tom Johnson",
    email: "tom@example.com",
    role: "Viewer",
    status: "Active",
  },
];

const QuoteDetail = () => {
  const { tripid } = useParams();
  const [data, setData] = useState([]);

  const getAlldata = () => {
    axios.get(`${serverUrl}/api/quote/quotes/${tripid}`).then((res) => {
      setData(res.data.data);
      console.log(res);
    });
  };

  useEffect(() => {
    getAlldata();
    return () => {
      console.log("Avoid errors");
    };
  }, []);

  const getStatusColorbackground = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500"; // Green
      case "Quoted":
        return "bg-blue-500"; // Blue
      case "Follow Up":
        return "bg-orange-500"; // Orange
      case "Confirmed":
        return "bg-green-900"; // Dark Green
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

  return (
    <div className="flex gap-5 ">
      
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

            {/* Content on top of the background */}
            <div className="absolute inset-0 flex flex-col p-4 pb-0 justify-between z-10">
              <div className="text-3xl text-white font-semibold">
                Quote details
              </div>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden mt-5">
          <div className="p-8 pb-0 flex justify-between">
            <div className=" w-[50%] text-xl text-semibold">
              <span
                className={`px-4 py-2 rounded-md text-sm text-white ${getStatusColorbackground(
                  data?.status
                )}`}
              >
                {data?.status}
              </span>{" "}
              {tripid}
            </div>
            <div className=" w-[50%] flex justify-end pb-2 gap-5 w-full">
              <Link to={`/create-intinary/${tripid}`}>
                <Button type="submit" className="bg-main text-white">
                  Create itinary
                </Button>
              </Link>
            </div>
          </div>
          <CardBody className="p-8">
            <div className=" w-[50%]">
              <div className="flex justify-between">
                <div className="text-start w-[30%]">
                  <div className="text-gray-600">Starting date</div>
                  <div>{data?.startDate?.split("T")[0]}</div>
                </div>
                <div className="text-start w-[30%]">
                  <div className="text-gray-600">Ending date</div>
                  <div>{data?.endDate?.split("T")[0]}</div>
                </div>
              </div>
              <div className="flex justify-between mt-5">
                <div className="text-start w-[30%]">
                  <div className="text-gray-600">Destination</div>
                  <div>{data?.destination?.title}</div>
                </div>
                <div className="text-start w-[30%]">
                  <div className="text-gray-600">No. of traveller</div>
                  <div>{data?.numberOfTravellers}</div>
                </div>
              </div>
              <div className="flex justify-between mt-5">
                <div className="text-start w-[30%]">
                  <div className="text-gray-600">Duration</div>
                  <div>{data?.duration}</div>
                </div>
                <div className="text-start w-[30%]">
                  <div className="text-gray-600">Travellers</div>
                  <div>
                    {" "}
                    {data?.travellers?.slice(0, 2).map((participant, index) => (
                      <span key={index}>
                        {participant.name}
                        {index < 1 && data?.travellers?.length >= 2 ? ", " : ""}
                      </span>
                    ))}
                    {data?.travellers?.length > 2 && (
                      <span> and {data?.travellers?.length - 2} more</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-5">
                <div className="text-start w-[30%]">
                  <div className="text-gray-600">Created by</div>
                  <div>{data?.createdBy?.name || "Unknown"}</div>
                </div>
                {/* <div className="text-start w-[30%]">
                  <div className="text-gray-600">Travellers</div>
                  <div>
                    {" "}
                    {data?.travellers?.slice(0, 2).map((participant, index) => (
                      <span key={index}>
                        {participant.name}
                        {index < 1 && data?.travellers?.length >= 2 ? ", " : ""}
                      </span>
                    ))}
                    {data?.travellers?.length > 2 && (
                      <span> and {data?.travellers?.length - 2} more</span>
                    )}
                  </div>
                </div> */}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      {/* <AddDestination
        isOpen={isAddTravelSummeryModal}
        onClose={() => setIsAddTravelSummeryModal(false)}
        getAlldata={getAlldata}
      /> */}
    </div>
  );
};

export default QuoteDetail;
