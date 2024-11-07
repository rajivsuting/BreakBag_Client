import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Button, Input, Textarea } from "@material-tailwind/react";
import { MdDelete, MdEdit } from "react-icons/md";
import { LuPlusCircle } from "react-icons/lu";

import {
  Card,
  CardBody,
  Typography,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import AddTravelSummery from "../components/AddTravelSummery";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { serverUrl } from "../api";
import axios from "axios";
import Addagents from "../components/Addagents";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useParams } from "react-router-dom";

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

const Agentroutes = () => {
  const { userid } = useParams();
  const [data, setData] = useState([]);
  const [toogleLead, setToogleLead] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Agent");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [teamLeadAll, setteamLeadAll] = useState([]);
  const [selectedTeamLead, setSelectedTeamLead] = useState(""); // null initially

  const options = teamLeadAll.map((agent) => ({
    value: agent._id,
    label: agent.name,
  }));

  const getAllData = () => {
    axios.get(`${serverUrl}/api/agent/quotes/?userId=${userid}`).then((res) => {
      console.log(res);
      setData(res.data.data);
    });
  };

  useEffect(() => {
    getAllData();
    return () => {
      console.log("Avoid errors");
    };
  }, [userid]);

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

  const activeQuote = data?.quotes?.filter(
    (el) => el.status == "Active"
  ).length;
  const quotedQuote = data?.quotes?.filter(
    (el) => el.status == "Quoted"
  ).length;
  const followUpQuote = data?.quotes?.filter(
    (el) => el.status == "Follow Up"
  ).length;
  const confirmedQuote = data?.quotes?.filter(
    (el) => el.status == "Confirmed"
  ).length;
  const cancelledQuote = data?.quotes?.filter(
    (el) => el.status == "Cancelled"
  ).length;
  const groupsQuote = data?.quotes?.filter(
    (el) => el.status == "Groups"
  ).length;
  const cnpQuote = data?.quotes?.filter((el) => el.status == "CNP").length;

  // console.log( localStorage.getItem("agent"))

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
                Agent details
              </div>

              <div className="flex justify-between items-center pb-2 gap-5 w-full">
                {/* Paginatioan and Icons */}
              </div>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden mt-5">
          <CardBody className="p-8">
            <div className=" w-[100%]">
              <div className="mt-5 mb-5 text-xl font-bold text0black">
                Agent details
              </div>

              <div className="flex justify-between">
                <div className="text-start w-[30%]">
                  <div className="text-gray-600 font-bold">Agent name</div>
                  <div>{data?.user?.name}</div>
                </div>
                <div className="text-start w-[30%]">
                  <div className="text-gray-600 font-bold">
                    Agent email address
                  </div>
                  <div>{data?.user?.email}</div>
                </div>
                <div className="text-start w-[30%]">
                  <div className="text-gray-600 font-bold">Phone number</div>
                  <div>{data?.user?.phone}</div>
                </div>
              </div>

              <div className="flex justify-between gap-5 mt-5">
                <div className="w-[20%] p-4 rounded shadow">
                  <div className="text-xl font-bold text0black">
                    Traveller list
                  </div>
                  {
                    !JSON.parse(localStorage.getItem("agent"))?.travellers?.length ? <div className="mt-5">
                    No traveller found !!
                  </div> : 
                  <div className="mt-2">
                    {JSON.parse(localStorage.getItem("agent"))?.travellers?.map(
                      (el) => {
                        return <div>{el.name}</div>;
                      }
                    )}
                  </div>
                  }
                </div>
                <div className="w-[80%] p-4 rounded shadow">
                  <div className="text-xl font-bold text0black">
                    Quote list
                  </div>
                  {!data?.quotes?.length ? (
                    <div className="mt-5">
                      No quotes found !!
                    </div>
                  ) : (
                    <>
                      <div className="mt-5 mb-5 text-xl font-bold text0black">
                        Performance
                      </div>
                      <div className="flex justify-between mt-5">
                        <div className="text-start w-[30%]">
                          <div className="text-gray-600 font-bold">
                            Total quotes
                          </div>
                          <div>{data?.totalQuotes || 0}</div>
                        </div>
                        <div className="text-start w-[30%]">
                          <div className="text-gray-600 font-bold">Active</div>
                          <div>{activeQuote || 0}</div>
                        </div>
                        <div className="text-start w-[30%]">
                          <div className="text-gray-600 font-bold">Quoted</div>
                          <div>{quotedQuote || 0}</div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-5">
                        <div className="text-start w-[30%]">
                          <div className="text-gray-600 font-bold">
                            Follow Up
                          </div>
                          <div>{followUpQuote || 0}</div>
                        </div>
                        <div className="text-start w-[30%]">
                          <div className="text-gray-600 font-bold">
                            Confirmed
                          </div>
                          <div>{confirmedQuote}</div>
                        </div>
                        <div className="text-start w-[30%]">
                          <div className="text-gray-600 font-bold">
                            Cancelled
                          </div>
                          <div>{cancelledQuote || 0}</div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-5">
                        <div className="text-start w-[30%]">
                          <div className="text-gray-600 font-bold">CNP</div>
                          <div>{cnpQuote || 0}</div>
                        </div>
                        <div className="text-start w-[30%]">
                          <div className="text-gray-600 font-bold">Groups</div>
                          <div>{groupsQuote || 0}</div>
                        </div>
                        <div className="text-start w-[30%]"></div>
                      </div>

                      {data?.length == 0 ? (
                        <div className="text-center mt-5">
                          You donot have any quote, please create one!!{" "}
                        </div>
                      ) : null}
                      <table className="w-full table-auto text-left">
                        <tbody>
                          {data?.quotes?.map((user, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-100 transition-colors duration-200 border"
                            >
                              <td
                                className={`w-[100px] text-center text-sm px-4 py-4 bg text-white ${getStatusColorbackground(
                                  user.status
                                )}`}
                              >
                                {user.status}
                              </td>
                              <Link to={`/quote-detail/${user.tripId}`}>
                                <td className="px-4 py-4 hover:text-main hover:border-b-2 hover:border-main transition-all duration-200">
                                  {user.tripId}
                                </td>
                              </Link>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              </div>

              {/* {
                data?.message ?               } */}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Agentroutes;
