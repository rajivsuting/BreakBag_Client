import { Button, Input, Textarea } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import usePreventScrollOnNumberInput from "../CustomHook/usePreventScrollOnNumberInput";
import { serverUrl } from "../api";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditActivity = ({ isOpen, onClose, getAlldata, singleActivity }) => {
  usePreventScrollOnNumberInput();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    description: [""],
  });
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [destinationAll, setDestinationAll] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [previews, setPreviews] = useState([]);

  const options = destinationAll.map((destination) => ({
    value: destination._id,
    label: destination.title,
  }));

  useEffect(() => {
    if (singleActivity) {
      setFormData(singleActivity);
      setFiles(singleActivity?.images);
      setSelectedDestination(singleActivity?.destination?._id);
    }
  }, [singleActivity]);

  useEffect(() => {
    if (singleActivity && destinationAll.length > 0) {
      // Find the option that matches the existing destination ID
      const existingDestination = destinationAll.find(
        (dest) => dest._id === singleActivity.destination?._id
      );
      if (existingDestination) {
        setSelectedDestination({
          value: existingDestination._id,
          label: existingDestination.title,
        });
      }
    }
  }, [singleActivity, destinationAll]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/destination/destinaions`);
        setDestinationAll(res.data.data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (selectedDestination) {
      setFormData((prevState) => ({
        ...prevState,
        destination: selectedDestination.value,
      }));
    }
  }, [selectedDestination]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...formData.description];
    newDescriptions[index] = value;
    setFormData({ ...formData, description: newDescriptions });
  };

  const handleAddDescription = () => {
    setFormData((prevState) => ({
      ...prevState,
      description: [...prevState.description, ""],
    }));
  };

  const handleRemoveDescription = (index) => {
    const newDescriptions = formData.description.filter((_, i) => i !== index);
    setFormData({ ...formData, description: newDescriptions });
  };

  // Updated handleFileChange function
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Combine new files with existing files, preventing duplicates by checking file names
    const allFiles = [...files, ...selectedFiles].reduce((acc, file) => {
      if (!acc.some((f) => f.name === file.name)) {
        acc.push(file);
      }
      return acc;
    }, []);

    // Check if the combined total exceeds 3 files
    if (allFiles.length > 3) {
      setFileError("You can only select up to 3 images.");
    } else {
      setFiles(allFiles);
      setFileError(""); // Clear error if 3 or fewer files
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fileError) {
      return; // Prevent form submission if file validation fails
    }
    setIsLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    formData?.description?.forEach((description, i) => {
      data.append(`description[${i}]`, description);
    });
    data.append("destination", formData.destination);

    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        data.append("images", file);
      });
    }

    try {
      const response = await axios.put(
        `${serverUrl}/api/activity/edit/${singleActivity._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      toast.success("Activity updated successfully");
      getAlldata();
      setFormData({ title: "", destination: "", description: [""] });
      setFiles([]);
      setSelectedDestination(null);
      onClose();
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorMessage =
          error.response.data.message || "Something went wrong";
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
        toast.error("Network Error: No response received from the server.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  console.log(files);

  useEffect(() => {
    const generatePreviews = async () => {
      const previewUrls = await Promise.all(
        files.map((file) => {
          if (typeof file === "string") {
            // If it's a CDN link, use it directly
            return file;
          } else if (file instanceof File) {
            // If it's a File object, read it using FileReader
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(file);
            });
          }
          return null;
        })
      );
      setPreviews(previewUrls);
    };

    generatePreviews();
  }, [files]);

  // console.log(previews);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="sidebar relative m-4 w-2/5 min-w-[50%] max-w-[50%] max-h-[90vh] overflow-y-auto rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center justify-end font-sans text-2xl font-semibold text-blue-gray-900">
          <AiOutlineClose
            className="cursor-pointer text-sm text-red-500 hover:bg-main hover:text-white rounded-[50%] p-1"
            size={24}
            onClick={onClose}
          />
        </div>
        <div>
          <form onSubmit={handleSubmit} className="m-auto">
            <div className="m-auto mb-5">
              <div className="font-normal text-xl">Edit Activity</div>
            </div>
            <div className="flex justify-between items-center m-auto gap-10 mt-5">
              <div className="w-[100%]">
                <Select
                  value={selectedDestination}
                  onChange={setSelectedDestination}
                  options={options}
                  placeholder="Select a destination"
                />
              </div>
              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChangeInput}
              />
            </div>
            <div className="flex flex-col gap-2 mt-5">
              {/* Reduced gap to 2 */}
              <Input
                label="Upload Images"
                name="file"
                type="file"
                multiple
                disabled={files?.length >= 3}
                required={files?.length >= 3}
                onChange={handleFileChange}
                className={`${fileError ? "border-red-500" : ""}`}
              />
              {/* Display file error message (if any) directly below the input */}
              {fileError && (
                <p className="text-red-500 text-sm mt-1">{fileError}</p>
              )}
              {/* Dynamically colored file count */}
              <p
                className={`text-sm ${
                  files?.length === 3 ? "text-green-500" : "text-red-500"
                }`}
              >
                Selected images: {files?.length}/3
              </p>
              {/* Display selected file names with reduced spacing */}
              <ul className="text-sm mt-1">
                {/* {" "}
                {previews.map((src, index) => (
                src && <img key={index} src={src} className="w-32 mb-2" alt={`preview-${index}`} />
            ))} */}
                {previews?.map((file, index) => (
                  <li key={index} className="flex items-center">
                    <img
                      key={index}
                      src={file}
                      className="w-32 mb-2"
                      alt={`preview-${index}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFiles(files.filter((_, i) => i !== index));
                        if (file.slice(0, 4) == "http") {
                          axios
                            .patch(
                              `${serverUrl}/api/activity/activities/${singleActivity?._id}/remove-images`,
                              { imageUrl: file }
                            )
                            .then((res) => {
                              console.log(res);
                            });
                        }
                      }}
                      className="text-red-500 underline ml-2"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="m-auto mt-5">
              <div className="font-normal text-lg mb-2">Points</div>
              {formData?.description?.map((description, index) => (
                <div key={index} className="flex gap-4 mb-4">
                  <Textarea
                    label={`Point ${index + 1}`}
                    name={`description${index}`}
                    className="min-h-[50px] h-auto"
                    value={description}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
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
            </div>
            <div className="w-[90%] flex justify-center items-center text-center mt-5 m-auto">
              <Button className="bg-main" type="submit" disabled={isLoading}>
                {isLoading ? "Editing Activity..." : "Edit Activity"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditActivity;
