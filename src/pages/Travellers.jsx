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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const Travellers = () => {
  const [isAddTravellersModal, setIsAddTravellersModal] = useState(false);
  const [data, setData] = useState([]);

  const getAlldata = () => {
    axios.get(`${serverUrl}/api/traveller/all`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      console.log(res)
      setData(res.data.travellers);
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
    axios
      .delete(`${serverUrl}/api/traveller/delete/${id}`)
      .then((res) => {
         toast.success("Traveller deleted");
        getAlldata();
      })
      .catch((err) => {
         toast.success(err.response.data.error);
      });
  };

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
              <div className="text-3xl text-white font-semibold">
                Travellers
              </div>

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
                      onClick={() => setIsAddTravellersModal(true)}
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
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Date of birth</th>
                  <th className="px-4 py-2">User type</th>
                  <th className="px-4 py-2"></th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.phone}</td>
                    <td className="px-4 py-2">{user.address}</td>
                    <td className="px-4 py-2">{user.dateOfBirth.split("T")[0]}</td>
                    <td className="px-4 py-2">{user.userType}</td>
                    <td className="px-4 py-2">
                      <MdEdit className="h-5 w-5 text-maincolor2 cursor-pointer" />
                    </td>
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
      <Addtraveller
        isOpen={isAddTravellersModal}
        onClose={() => setIsAddTravellersModal(false)}
        getAlldata={getAlldata}
      />
    </div>
  );
};

export default Travellers;
