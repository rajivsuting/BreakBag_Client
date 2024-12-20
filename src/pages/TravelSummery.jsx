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
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const TravelSummery = () => {
  const [isAddTravelSummeryModal, setIsAddTravelSummeryModal] = useState(false);
  const [isDeleteModal, setIsdeleteModal] = useState(false);
  const [singleTravelSummery, setSingleTravelSummery] = useState({});
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [searchParams, setsearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(Number(searchParams.get("page"))) || 1
  );
  const [limit, setLimit] = useState(
    Number(Number(searchParams.get("limit"))) || 10
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getAlldata = () => {
    axios
      .get(
        `${serverUrl}/api/travel-summary/travel-summary/?page=${currentPage}&limit=${limit}`
      )
      .then((res) => {
        setData(res.data.travelSummaries);
      });
  };

  useEffect(() => {
    setsearchParams({ page: currentPage, limit: limit });
    getAlldata();
    return () => {
      console.log("Avoid errors");
    };
  }, [currentPage, limit]);

  const handleSearch = (e) => {
    e.preventDefault();
    axios
      .get(`${serverUrl}/api/travel-summary/search/?keyword=${search}`)
      .then((res) => {
        console.log(res);
        setData(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleDelete = async () => {
    try {
      // Make the API call to submit the form data
      const response = await axios.delete(
        `${serverUrl}/api/travel-summary/delete/${singleTravelSummery._id}`
      );
      toast.success("Travel summary deleted successfully");
      getAlldata();
    } catch (error) {
      console.log(error);
      // Handle different types of errors
      if (error.response) {
        const status = error.response.status;
        const errorMessage =
          error.response.data.message || "Something went wrong";

        // Show custom error messages based on status codes
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
        // Network error (no response received)
        toast.error("Network Error: No response received from the server.");
      } else {
        // Something else happened
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      // setIsLoading(false);
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
                Travel Summary
              </div>

              <div className="flex justify-between items-center pb-2 gap-5 w-full">
                {/* Search Form */}
                <div className="w-[50%]">
                  <form
                    onSubmit={handleSearch}
                    className="flex justify-start items-center gap-5"
                  >
                    <div className="w-[50%]">
                      {/* Slightly dark background for the search box */}
                      <div className="bg-white rounded-md">
                        <Input
                          label="Search any travel summery..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          required
                          className="bg-white bg-opacity-70 text-black"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="bg-main text-white">
                      Search
                    </Button>
                    <Button
                      onClick={() => {
                        setSearch("");
                        getAlldata();
                        setCurrentPage(1);
                        setLimit(10);
                      }}
                      variant=""
                      disabled={!search}
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
                      onClick={() => {
                        setIsAddTravelSummeryModal(true);
                        setSingleTravelSummery({});
                      }}
                      className="h-6 w-6 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-end items-center">
                    <div className="flex justify-center items-center">
                      <RiArrowLeftSLine
                        className={`text-lg cursor-pointer ${
                          currentPage === 1
                            ? "text-gray-400 pointer-events-none"
                            : ""
                        }`}
                        onClick={() =>
                          currentPage !== 1 && handlePageChange(currentPage - 1)
                        }
                      />
                      <span className="px-5 font-medium">{currentPage}</span>
                      <RiArrowRightSLine
                        className={`text-lg cursor-pointer ${
                          data?.length < limit
                            ? "text-gray-400 pointer-events-none"
                            : ""
                        }`}
                        onClick={() =>
                          data?.length >= limit &&
                          handlePageChange(currentPage + 1)
                        }
                      />
                    </div>
                    <div>
                      {/* Slightly dark background for the pagination select */}
                      <div className="rounded-md p-2">
                        <select
                          className="border px-2 py-2 rounded-md text-black"
                          value={limit}
                          onChange={(e) => setLimit(e.target.value)}
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
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2"></th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {data?.map((user, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <td className="px-4 py-2">
                      {user.title.length <= 20
                        ? user.title
                        : user.title.slice(0, 20) + "..."}
                    </td>

                    <td className="px-4 py-2">
                      {user.description.length <= 40
                        ? user.description
                        : user.description.slice(0, 40) + "..."}
                    </td>
                    <td className="px-4 py-2">
                      <MdEdit
                        className="h-5 w-5 text-maincolor2 cursor-pointer"
                        onClick={() => {
                          setSingleTravelSummery(user);
                          setIsAddTravelSummeryModal(true);
                        }}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <MdDelete
                        className="h-5 w-5 text-main cursor-pointer"
                        onClick={() => {
                          setIsdeleteModal(true);
                          setSingleTravelSummery(user);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.length == 0 ? (
              <div className="text-center mt-5 mb-5">
                No travel summery found!!{" "}
              </div>
            ) : null}
          </CardBody>
        </Card>
      </div>
      <ConfirmDeleteModal
        isOpen={isDeleteModal}
        onClose={() => setIsdeleteModal(false)}
        handleDelete={handleDelete}
      />
      <AddTravelSummery
        isOpen={isAddTravelSummeryModal}
        singleTravelSummery={singleTravelSummery}
        onClose={() => {
          setIsAddTravelSummeryModal(false);
          setSingleTravelSummery({});
        }}
        getAlldata={getAlldata}
      />
    </div>
  );
};

export default TravelSummery;
