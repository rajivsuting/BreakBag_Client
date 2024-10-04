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
import { serverUrl } from "../api";
import axios from "axios";
import AddInclusion from "../components/AddInclusion";
import AddExclusion from "../components/AddExclusion";
import AddTransfer from "../components/AddTransfer";
import AddOtherinformation from "../components/AddOtherInformation";

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

const OtherInformation = () => {
  const [isAddTravelSummeryModal, setIsAddTravelSummeryModal] = useState(false);

  const [data, setData] = useState([]);

  const getAlldata = () => {
    axios.get(`${serverUrl}/api/other-information/other-information`).then((res) => {
      setData(res.data.data);
    });
  };

  useEffect(() => {
    getAlldata();
    return () => {
      console.log("Avoid errors");
    };
  }, []);

  return (
    <div className="flex gap-5 ">
      <Sidebar />
      <div className="w-[75%] m-auto mt-8 rounded-md">
        <div>
          <img src="/img/lanscape2.jpg" className="w-full h-[200px] mb-5 rounded-md" alt="" />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-2xl">Other Information</div>
        </div>
        <div className="flex justify-between items-center mb-2 gap-5">
          <div className="w-[50%]">
            <form className="flex justify-start items-center gap-5">
              <div className="w-[50%]">
                <Input
                  label="Search any title..."
                  name="password"
                  // type="search"
                  required

                  // type={showPassword ? "text" : "password"}
                />
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
          <div className="flex justify-end items-center mb-2 gap-5">
            <div className="">
              <LuPlusCircle
                onClick={() => setIsAddTravelSummeryModal(true)}
                className="h-6 w-6 text-maincolor2 cursor-pointer"
              />
            </div>
            <div className="flex justify-end items-center">
              <div className="flex justify-center items-center">
                <RiArrowLeftSLine
                  className={`text-lg cursor-pointer 
               
              `}
                  // onClick={() =>
                  //   currentPage !== 1 && handlePageChange(currentPage - 1)
                  // }
                />
                <span className="px-5 font-medium">{0}</span>
                <RiArrowRightSLine
                  className={`text-lg cursor-pointer text-gray-400 pointer-events-none`}
                  // onClick={() =>
                  //   cohortList?.length >= limit && handlePageChange(currentPage + 1)
                  // }
                />
              </div>
              <div>
                <select
                  className="border px-2 py-2 rounded-md mt-3 mb-3"
                  value={0}
                  // onChange={(e) => setLimit(e.target.value)}
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

        <Card className="overflow-hidden">
          <CardBody className="p-0">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2"></th>
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
                    {/* Titles Column */}
                    <td className="px-4 py-2">
                      {user.itemList.map((item, idx) => (
                        <div key={idx}>{item.title}</div>
                      ))}
                    </td>

                    {/* Descriptions Column */}
                    <td className="px-4 py-2">
                      {user.itemList.map((item, idx) => (
                        <div key={idx}>{item.description.join(", ")}</div>
                      ))}
                    </td>

                    {/* Images Column */}
                    {/* <td className="px-4 py-2">
                      {user.itemList.map((item, idx) => (
                        <div key={idx}>
                          {user.images[idx] ? (
                            <img
                              src={user.images[idx]}
                              alt={item.title}
                              className="w-20 h-20 object-cover"
                            />
                          ) : (
                            "No Image"
                          )}
                        </div>
                      ))}
                    </td> */}

                    {/* Action Buttons */}
                    <td className="px-4 py-2">
                      <MdRemoveRedEye className="h-5 w-5 text-maincolor2 cursor-pointer" />
                    </td>
                    <td className="px-4 py-2">
                      <MdEdit className="h-5 w-5 text-maincolor2 cursor-pointer" />
                    </td>
                    <td className="px-4 py-2">
                      <MdDelete className="h-5 w-5 text-main cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
      <AddOtherinformation
        isOpen={isAddTravelSummeryModal}
        onClose={() => setIsAddTravelSummeryModal(false)}
        getAlldata={getAlldata}
      />
    </div>
  );
};

export default OtherInformation;
