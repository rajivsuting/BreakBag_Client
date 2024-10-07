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

import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { serverUrl } from "../api";
import axios from "axios";
import Addtraveller from "../components/Addtraveller";
import AddQuote from "../components/AddQuote";
import { Link, useNavigate } from "react-router-dom";

const Travellers = () => {
  const navigate = useNavigate();
  const [isAddTravellersModal, setIsAddTravellersModal] = useState(false);
  const [data, setData] = useState([]);

  const getAlldata = () => {
    axios.get(`${serverUrl}/api/quote/quotes`).then((res) => {
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

  const handleEdit = () => {};

  const handleDelete = (id) => {
    // axios.delete(`${serverUrl}/api/traveller/delete/${id}`).then((res)=>{
    //   alert("Traveller deleted");
    //   getAlldata()
    // }).catch((err)=>{
    //   alert(err.response.data.error)
    // })
  };

  const getStatusColorbackground = (status) => {
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

  return (
    <div className="flex gap-5 ">
      <Sidebar />
      <div className="w-[75%] m-auto mt-8 rounded-md">
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
              <div className="text-3xl text-white font-semibold">Quote</div>

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
                    <Link to={"/add-quote"}>
                      <LuPlusCircle className="h-6 w-6 cursor-pointer" />
                    </Link>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden mt-5">
          <CardBody className="p-0">
            <table className="w-full table-auto text-left">
              
              <tbody>
                {data.map((user, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition-colors duration-200 border"
                  >
                    <td className={`w-[100px] text-center text-sm px-4 py-4 bg text-white ${getStatusColorbackground(user.status)}`}>
                      {user.status}
                    </td>
                    <Link to={`/quote-detail/${user.tripId}`}>
                      <td className="px-4 py-4 hover:text-main hover:border-b-2 hover:border-main transition-all duration-200">
                        {user.tripId}
                      </td>
                    </Link>
                    {/* <td className="px-4 py-2">
                    {user.travellers?.slice(0, 2).map((el, index) => (
                      <span key={index}>
                        {el.name}
                        {index < 1 && user.travellers.length > 2 ? ", " : ""}
                      </span>
                    ))}
                    {user.travellers.length > 2 && (
                      <span> and {user.travellers.length - 2} more</span>
                    )}
                    </td> */}
                    {/* <td className="px-4 py-2">{user.destination?.title || "-"}</td> */}
                    {/* <td className="px-4 py-2">{user.startDate.split("T")[0]}</td>
                    <td className="px-4 py-2">{user.endDate.split("T")[0]}</td>
                    <td className="px-4 py-2">{user.numberOfTravellers}</td>
                    <td className="px-4 py-2">{user.duration}</td> */}
                    {/* <td className="px-4 py-2">
                      <MdEdit className="h-5 w-5 text-maincolor2 cursor-pointer" />
                    </td> */}
                    <td className="px-4 py-2">
                      <MdDelete
                        onClick={() => handleDelete(user._id)}
                        className="h-5 w-5 text-main cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Travellers;
