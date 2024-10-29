import { Button, Input, Textarea } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { serverUrl } from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddInclusion = ({ isOpen, onClose, getAlldata }) => {
  const [inclusiondata, setInclusiondata] = useState({
    title: "",
    description: [""],
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const { title, description } = inclusiondata;

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "title") {
      setInclusiondata({ ...inclusiondata, title: value });
    } else {
      const newDescriptions = [...description];
      newDescriptions[index] = value;
      setInclusiondata({ ...inclusiondata, description: newDescriptions });
    }
  };

  const handleAddDescription = () => {
    setInclusiondata({ ...inclusiondata, description: [...description, ""] });
  };

  const handleRemoveDescription = (index) => {
    const newDescriptions = description.filter((_, i) => i !== index);
    setInclusiondata({ ...inclusiondata, description: newDescriptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${serverUrl}/api/inclusion/inclusions/create`,
        inclusiondata
      );
      toast.success("Inclusion added successfully");
      getAlldata();
      setInclusiondata({ title: "", description: [""] });
      onClose();
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data.message || "Something went wrong";
        switch (status) {
          case 400:
            toast.error(`Bad Request: ${errorMessage}`);
            break;
          case 401:
            toast.error("Unauthorized: Please log in again.");
            break;
          case 403:
            toast.error("Forbidden: You do not have permission to perform this action.");
            break;
          case 404:
            toast.error("Not Found: The requested resource could not be found.");
            break;
          case 500:
            toast.error("Server Error: Please try again later.");
            break;
          default:
            toast.error(`Error: ${errorMessage}`);
        }
      } else if (error.request) {
        toast.error("Network Error: No response received from the server.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="sidebar relative m-4 w-2/5 max-w-[90%] max-h-[90vh] overflow-y-auto rounded-lg bg-white text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center justify-end font-sans text-2xl font-semibold text-blue-gray-900">
          <AiOutlineClose
            className="cursor-pointer text-sm text-red-500 hover:bg-main hover:text-white rounded-[50%] p-1"
            size={24}
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-xl font-normal">Add Inclusion</div>
          <Input
            label={`Title`}
            value={title}
            name="title"
            onChange={handleChange}
            required
          />

          <div className="space-y-3">
            {description.map((desc, index) => (
              <div key={index} className="flex items-center gap-2">
                <Textarea
                  label={`Point ${index + 1}`}
                  value={desc}
                  name="description"
                  onChange={(e) => handleChange(e, index)}
                  className="min-h-[50px] h-auto"
                  required
                />
                {index > 0 ? (
                    <div>
                      <AiOutlineClose
                        className="cursor-pointer text-sm text-red-500 hover:bg-main hover:text-white rounded-[50%] p-1"
                        size={24}
                        onClick={() => handleRemoveDescription(index)}
                      />
                    </div>
                  ) : (
                    <div>
                      <AiOutlinePlus
                        className="cursor-pointer text-sm text-green-500 hover:bg-main hover:text-white rounded-[50%] p-1"
                        size={24}
                        onClick={handleAddDescription}
                      />
                    </div>
                  )}
              </div>
            ))}
            {/* <button
              type="button"
              onClick={handleAddDescription}
              className="flex items-center gap-2 text-blue-500"
            >
              <AiOutlinePlus /> Add Description
            </button> */}
          </div>

          <div className="flex justify-center">
            <Button className="bg-main" type="submit" disabled={isLoading}>
              {isLoading ? "Adding Inclusion..." : "Add Inclusion"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInclusion;
