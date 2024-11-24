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
import { Link } from "react-router-dom";
import EditAgent from "../components/EditAgent";

const Agents = () => {
  const [isAddAgentsModal, setIsAddAgentsModal] = useState(false);
  const [singleAgent, setSingleAgent] = useState({});
  const [updateing, setUpdating] = useState(false);
  const [isEditAgentModal, setIsEditAgentModal] = useState(false);
  const [data, setData] = useState([]);
  const [toogleLead, setToogleLead] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Agent");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [teamLeadAll, setteamLeadAll] = useState([]);
  const [selectedTeamLead, setSelectedTeamLead] = useState(""); // null initially

  const getAllDataTeamlead = () => {
    axios
      .get(`${serverUrl}/api/agent/all/?role=${"Team Lead"}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setteamLeadAll(res.data.data);
      });
  };

  const options = teamLeadAll.map((agent) => ({
    value: agent._id,
    label: agent.name,
  }));

  useEffect(() => {
    getAllDataTeamlead();
    return () => {
      console.log("Avoid errors");
    };
  }, []);

  const getAllData = () => {
    axios
      .get(`${serverUrl}/api/agent/all/?role=${selectedRole}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
        setData(res.data.data);
      });
  };

  const handleToogle = () => {
    setToogleLead(!toogleLead);
  };

  useEffect(() => {
    getAllData();
    return () => {
      console.log("Avoid errors");
    };
  }, [selectedRole]);

  useEffect(() => {
    // setUpdating(!updateing)
    if (selectedTeamLead) {
      axios
        .post(
          `${serverUrl}/api/agent/team-lead/${selectedTeamLead}/assign-agents`,
          [selectedAgent]
        )
        .then((res) => {
          toast.success("Team lead assigned");
        })
        .catch((err) => {
          console.log(err);
          toast.success("Something went wrong");
        });
    }
    // setUpdating(!updateing)
  }, [selectedTeamLead]);

  // console.log(selectedTeamLead,
  //   selectedAgent)

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
                Agents and teamleads
              </div>

              <div className="flex justify-end items-center pb-2 gap-5 w-full">
                <div className="flex justify-end items-center gap-5 text-white">
                  <div className="">
                    <LuPlusCircle
                      onClick={() => setIsAddAgentsModal(true)}
                      className="h-6 w-6 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-end items-center">
                    {localStorage.getItem("userRole") == "Team Lead" ? null : (
                      <div>
                        {/* Slightly dark background for the pagination select */}
                        <div className="rounded-md p-2">
                          <select
                            className="border px-2 py-2 rounded-md text-black"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                          >
                            <option value="Agent">Agent</option>
                            <option value="Team Lead">Team lead</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden mt-5">
          <CardBody className="p-0">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  {selectedRole == "Team Lead" ||
                  localStorage.getItem("userRole") == "Team Lead" ||
                  localStorage.getItem("userRole") == "Agent" ? null : (
                    <th className="px-4 py-2">Assign to a team lead</th>
                  )}
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>

              <tbody>
                {data?.map((user, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Link to={`/agent-details/${user._id}`}>
                      <td
                        onClick={() =>
                          localStorage.setItem("agent", JSON.stringify(user))
                        }
                        className="px-4 py-4 hover:text-main hover:border-b-2 hover:border-main transition-all duration-200"
                      >
                        {user.name}
                      </td>
                    </Link>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.phone}</td>
                    {selectedRole == "Team Lead" ||
                    localStorage.getItem("userRole") == "Team Lead" ||
                    localStorage.getItem("userRole") == "Agent" ? null : (
                      <td className="px-4 py-2">
                        <select
                          value={user.teamLead ? user.teamLead._id : ""}
                          onChange={(e) => {
                            setSelectedTeamLead(e.target.value);
                            setSelectedAgent(user._id);
                            setUpdating(!updateing);
                          }}
                        >
                          <option value="">Select a team lead</option>
                          {teamLeadAll?.map((el) => {
                            return (
                              <option key={el._id} value={el._id}>
                                {el.name}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                    )}

                    <td className="px-4 py-2">
                      <MdEdit
                        className="h-5 w-5 text-maincolor2 cursor-pointer"
                        onClick={() => {
                          setSingleAgent(user);
                          setIsEditAgentModal(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.length == 0 ? (
              <div className="text-center mt-5 mb-5">
                No agent and teamlead found!!{" "}
              </div>
            ) : null}
          </CardBody>
        </Card>
      </div>
      <Addagents
        isOpen={isAddAgentsModal}
        onClose={() => setIsAddAgentsModal(false)}
        getAllData={getAllData}
      />
      <EditAgent
        singleAgent={singleAgent}
        isOpen={isEditAgentModal}
        onClose={() => setIsEditAgentModal(false)}
        getAllData={getAllData}
      />
    </div>
  );
};

export default Agents;
