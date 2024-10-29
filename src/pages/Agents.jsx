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

const Agents = () => {
  const [isAddAgentsModal, setIsAddAgentsModal] = useState(false);
  const [data, setData] = useState([]);
  const [toogleLead, setToogleLead] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Agent");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [teamLeadAll, setteamLeadAll] = useState([]);
  const [selectedTeamLead, setSelectedTeamLead] = useState(""); // null initially

  const getAllDataTeamlead = () => {
    axios.get(`${serverUrl}/api/agent/all/?role=${"Team Lead"}`).then((res) => {
      setteamLeadAll(res.data.data);
    });
  };
  const options = teamLeadAll.map((agent) => ({
    value: agent._id,
    label: agent.name,
  }));
  console.log(options);
  useEffect(() => {
    getAllDataTeamlead();
    return () => {
      console.log("Avoid errors");
    };
  }, []);

  const getAllData = () => {
    axios
      .get(`${serverUrl}/api/agent/all/?role=${selectedRole}`)
      .then((res) => {
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
  }, [selectedTeamLead]);

  // console.log(selectedTeamLead,
  //   selectedAgent)

  return (
    <div className="flex gap-5 ">
      <Sidebar />
      <div className="w-[100%] m-auto mt-3 rounded-md ml-[20rem] p-4">
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
              <div className="text-3xl text-white font-semibold">Agents</div>

              <div className="flex justify-between items-center pb-2 gap-5 w-full">
                {/* Search Form */}
                <div className="w-[50%]">
                  <form className="flex justify-start items-center gap-5">
                    <div className="w-[50%]">
                      {/* Slightly dark background for the search box */}
                      <div className="bg-white rounded-md">
                        <Input
                          label="Search any title..."
                          name="password"
                          required
                          className="bg-white bg-opacity-70 text-black"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="bg-main text-white">
                      Search
                    </Button>
                    <Button
                      type="button"
                      className="bg-white text-main border border-main"
                    >
                      Clear
                    </Button>
                  </form>
                </div>

                {/* Pagination and Icons */}
                <div className="flex justify-end items-center gap-5 text-white">
                  <div className="">
                    <LuPlusCircle
                      onClick={() => setIsAddAgentsModal(true)}
                      className="h-6 w-6 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-end items-center">
                    <div className="flex justify-center items-center">
                      <RiArrowLeftSLine className={`text-lg cursor-pointer`} />
                      <span className="px-5 font-medium">{0}</span>
                      <RiArrowRightSLine
                        className={`text-lg cursor-pointer text-gray-400 pointer-events-none`}
                      />
                    </div>
                    <div>
                      {/* Slightly dark background for the pagination select */}
                      <div className="rounded-md p-2">
                        <select
                          className="border px-2 py-2 rounded-md text-black"
                          value={0}
                        >
                          <option value="5">5 per page</option>
                          <option value="10">10 per page</option>
                          <option value="15">15 per page</option>
                          <option value="20">20 per page</option>
                        </select>
                      </div>
                    </div>
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
                  {/* <th className="px-4 py-2"></th>
                  <th className="px-4 py-2"></th> */}
                </tr>
              </thead>
              <tbody>
                {data?.map((user, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Link to={`/agent-details/${user._id}`}> 
                    <td className="px-4 py-4 hover:text-main hover:border-b-2 hover:border-main transition-all duration-200">{user.name}</td></Link>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.phone}</td>
                    {selectedRole == "Team Lead" ||
                    localStorage.getItem("userRole") == "Team Lead" ||
                    localStorage.getItem("userRole") == "Agent" ? null : (
                      <td className="px-4 py-2">
                        <select
                          value={selectedTeamLead}
                          onChange={(e) => {
                            setSelectedTeamLead(e.target.value);
                            setSelectedAgent(user._id);
                          }}
                        >
                          <option value="">Select a team lead</option>
                          {teamLeadAll?.map((el) => {
                            return <option value={el._id}>{el.name}</option>;
                          })}
                        </select>
                      </td>
                    )}
                    {/* <td className=" px-4 py-2">
                      {user.isTeamlead ? (
                        <div className="w-[80px] flex justify-start items-center gap-1 text-emerald-700 px-1 w-[60px] rounded-[50px] text-center mt-2 font-semibold text-xs">
                          <span
                            className={`w-2 h-2 border  rounded-[50%] bg-green-500`}
                          ></span>{" "}
                          <span className="">Team lead</span>
                        </div>
                      ) : (
                        <div className="flex justify-start items-center gap-1 p-1 w-[80px] rounded-[50px] text-center text-rose-500 mt-2 font-semibold text-xs">
                          <span
                            className={`w-2 h-2 border rounded-[50%] bg-blue-500`}
                          ></span>{" "}
                          Agent
                        </div>
                      )}
                    </td> */}
                    {/* <td className="px-4 py-2 cursor-pointer relative group">
                      <div onClick={handleToogle}>
                        <ToogleTeamLead
                          active={user.isTeamlead}
                          id={user._id}
                        />
                      </div>
                      <ul className="w-[150px] absolute right-0 shadow text-center hidden bg-white border rounded p-2 text-gray-700 group-hover:block z-10">
                        <li className=" flex justify-center items-center gap-2 w-full text-xs font-semibold">
                          <FiInfo className="font-bold" /> Make him{" "}
                          {user.isTeamlead ? "Agent " : "Team lead"}
                        </li>
                      </ul>
                    </td> */}

                    {/* <td className="px-4 py-2">
                      <MdEdit className="h-5 w-5 text-maincolor2 cursor-pointer" />
                    </td>
                    <td className="px-4 py-2">
                      <MdDelete className="h-5 w-5 text-main cursor-pointer" />
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
      <Addagents
        isOpen={isAddAgentsModal}
        onClose={() => setIsAddAgentsModal(false)}
        getAllData={getAllData}
      />
    </div>
  );
};

export default Agents;
