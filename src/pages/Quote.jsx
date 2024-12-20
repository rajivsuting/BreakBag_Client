import React, { useEffect, useMemo, useState } from "react";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Addcomment from "../components/Addcomment";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import AddQuote from "../components/AddQuote";

const Travellers = () => {
  const navigate = useNavigate();
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [quoteDeleteModal, setQuoteDeleteModal] = useState(false);
  const [singleQuote, setSinglequote] = useState({});
  const [selectedQuote, setSelectedQuote] = useState("");
  const [selectedId, setSelctedId] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [searchParams, setsearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [isAddTravelSummeryModal, setIsAddTravelSummeryModal] = useState(false);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10); // default limit

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getAlldata = () => {
    axios
      .get(
        `${serverUrl}/api/quote/quotes/?page=${currentPage}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setData(res.data.data.quotes);
        console.log(res);
      });
  };

  useEffect(() => {
    setsearchParams({ page: currentPage, limit: limit });
    getAlldata();
    return () => {
      console.log("Avoid errors");
    };
  }, [currentPage, limit]);

  const handleEdit = () => {};

  useMemo(() => {
    if (selectedQuote && selectedId) {
      axios
        .patch(`${serverUrl}/api/quote/edit/${selectedId}`, {
          status: selectedQuote,
        })
        .then((res) => {
          toast.success("Status updated");
          getAlldata();
        })
        .catch((err) => {
          toast.error("Failed to update status, please try again");
        });
    }
  }, [selectedQuote, selectedId]);

  const handleDelete = async () => {
    try {
      // Make the API call to submit the form data
      const response = await axios.delete(
        `${serverUrl}/api/quote/delete/${singleQuote._id}`
      );
      toast.success("Quote deleted successfully");
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

  const handleComment = (quote) => {
    setCommentModalOpen(true);
    setsearchParams({ quote });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    axios
      .get(`${serverUrl}/api/quote/search/?search=${search}`)
      .then((res) => {
        console.log(res);
        setData(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="">
      {/*  */}
      <div className=" rounded-md p-4 rounded-md p-4">
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
                  <form
                    className="flex justify-start items-center gap-5"
                    onSubmit={handleSearch}
                  >
                    <div className="w-[50%]">
                      {/* Slightly dark background for the search box */}
                      <div className="bg-white rounded-md">
                        <Input
                          label="Search any quote by traveller..."
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
                      type="button"
                      disabled={!search}
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
                        navigate("/add-quote");
                        setIsAddTravelSummeryModal(true);
                        setSingleActivity({});
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

        {/* Add margin here to push content down below the image */}
        <div className="mt-5">
          {/* <Card className="overflow-hidden mt-5">
        <CardBody className="p-0"> */}
          {data?.length == 0 ? (
            <div className="text-center mt-5">
              You donot have any quote, please create one!!{" "}
            </div>
          ) : null}
          <table className="w-full table-auto text-left">
            <tbody>
              {data?.map((user, index) => (
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
                  <td className="px-4 py-2 cursor-pointer">
                    {user?.travellers?.map((participant, index) => (
                      <div key={index}>
                        {participant.name}
                        {/* {index < 1 && data?.travellers?.length >= 2 ? ", " : ""} */}
                      </div>
                    ))}
                    {/* {user?.comments?.length == 0 ? null : (
                      <div className="relative group">
                        {
                          user?.comments?.[user?.comments?.length - 1]?.author
                            ?.name
                        }{" "}
                        has put a comment
                        <ul className="w-[200px] absolute shadow text-center hidden bg-white border rounded p-2 text-gray-700 group-hover:block z-10 m-auto">
                          <li className=" flex justify-center items-center gap-2 w-full text-xs font-semibold">
                            {
                              user?.comments?.[user?.comments?.length - 1]
                                ?.content
                            }
                          </li>
                        </ul>
                      </div>
                    )} */}
                  </td>
                  <td className="px-4 py-2 flex justify-center items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-[50%]  ${getStatusColorbackground(
                        user.status
                      )}`}
                    ></span>
                    <select
                      value={user.status}
                      onChange={(e) => {
                        setSelectedQuote(e.target.value);
                        setSelctedId(user._id);
                      }}
                    >
                      <option value="">Select a status</option>
                      <option value="Active">Active</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Follow Up">Follow Up</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="CNP">CNP</option>
                      <option value="Groups">Groups</option>
                    </select>
                  </td>
                  {/* <td
                    onClick={() => handleComment(user._id)}
                    className="cursor-pointer px-4 py-2"
                  >
                    Add a comment
                  </td> */}
                  <td className="px-4 py-2">
                    <MdDelete
                      onClick={() => {
                        setQuoteDeleteModal(true);
                        setSinglequote(user);
                      }}
                      className="h-5 w-5 text-main cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={quoteDeleteModal}
        onClose={() => setQuoteDeleteModal(false)}
        handleDelete={handleDelete}
      />
      {/* <AddQuote
        isOpen={isAddTravelSummeryModal}
        onClose={() => setIsAddTravelSummeryModal(false)}
        getAlldata={getAlldata}
      /> */}
      {/* <Addcomment
        isOpen={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        getAlldata={getAlldata}
      /> */}
    </div>
  );
};

export default Travellers;
