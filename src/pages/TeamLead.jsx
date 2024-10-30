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
import ToogleTeamLead from "../components/ToogleTeamLead";
import { FiInfo } from "react-icons/fi";

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

const TeamLead = () => {
  const [isAddAgentsModal, setIsAddAgentsModal] = useState(false);
  const [data, setData] = useState([]);
  const [toogleLead, setToogleLead] = useState(false);
  const getAllData = () => {
    axios.get(`${serverUrl}/api/agent/all`).then((res) => {
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
  }, [toogleLead]);

  return (
    <div className="flex gap-5 ">
      
      <div className="w-[100%] m-auto mt-3 rounded-md p-4">Team lead</div>
    </div>
  );
};

export default TeamLead;
