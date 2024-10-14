import { Button, Input, Textarea } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { serverUrl } from "../api";
import Select from "react-select";

const AddInclusion = ({ isOpen, onClose, getAlldata }) => {
  const titles = [
    "Stay",
    "Meals",
    "Transfers",
    "Support",
    "Experience Covered",
  ];

  const [selectedTitle, setSelectedTitle] = useState("Stay");
  const [descriptions, setDescriptions] = useState({});
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDestination, setSelectedDestination] = useState("");

  if (!isOpen) return null;

  const handleDescriptionChange = (descIndex, e) => {
    const value = e.target.value;
    const updatedDescriptions = { ...descriptions };
    updatedDescriptions[selectedTitle][descIndex] = value;
    setDescriptions(updatedDescriptions);
  };

  const addDescription = () => {
    const updatedDescriptions = { ...descriptions };
    if (!updatedDescriptions[selectedTitle]) {
      updatedDescriptions[selectedTitle] = [""];
    } else {
      updatedDescriptions[selectedTitle].push("");
    }
    setDescriptions(updatedDescriptions);
  };

  const removeDescription = (descIndex) => {
    const updatedDescriptions = { ...descriptions };
    updatedDescriptions[selectedTitle] = updatedDescriptions[
      selectedTitle
    ].filter((_, i) => i !== descIndex);
    setDescriptions(updatedDescriptions);
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();

    // Include only descriptions with text
    data.append(
      "itemList",
      JSON.stringify(
        Object.keys(descriptions).map((title) => ({
          title,
          description: descriptions[title].filter((desc) => desc.trim() !== ""),
        }))
      )
    );
    data.append("destination", selectedDestination);

    if (images.length > 0) {
      Array.from(images).forEach((image) => {
        data.append("images", image);
      });
    }

    try {
      const response = await axios.post(
        `${serverUrl}/api/inclusion/inclusions/create`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      alert("Inclusion added successfully");
      getAlldata();
      setDescriptions({});
      setImages([]);
      setSelectedDestination("");
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="sidebar relative m-4 w-3/5 max-w-[90%] max-h-[90vh] overflow-y-auto rounded-lg bg-white text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center justify-end font-sans text-2xl font-semibold text-blue-gray-900">
          <AiOutlineClose
            className="cursor-pointer text-sm text-red-500 hover:bg-main hover:text-white rounded-[50%] p-1"
            size={24}
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-xl font-normal">Add Inclusion</div>
          <div className="flex justify-between items-center gap-5">
            <Input
              label="Upload Images"
              type="file"
              name="images"
              onChange={handleImageChange}
              multiple
              required
            />
          </div>

          <div className="flex justify-between gap-4 p-4">
            <div className="w-[30%] border-r pr-4">
              <h3 className="font-bold">Titles</h3>
              <div className="w-[100%] h-full bg-gray-100 p-4 rounded-lg overflow-y-auto">
                {titles.map((title, index) => (
                  <div
                    key={index}
                    className={`p-2 cursor-pointer ${
                      selectedTitle === title
                        ? "border-b-2 border-main text-main font-semibold"
                        : ""
                    }`}
                    onClick={() => setSelectedTitle(title)}
                  >
                    <span> {title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-[70%]">
              <h3 className="font-bold mb-4">Points for "{selectedTitle}"</h3>
              {selectedTitle &&
                descriptions[selectedTitle]?.map((desc, descIndex) => (
                  <div key={descIndex} className="flex gap-5 mb-4">
                    <Input
                      label={`Point ${descIndex + 1}`}
                      value={desc}
                      onChange={(e) => handleDescriptionChange(descIndex, e)}
                      required
                    />

                    <AiOutlineClose
                      className="cursor-pointer text-red-500"
                      size={24}
                      onClick={() => removeDescription(descIndex)}
                    />
                  </div>
                ))}
              {selectedTitle && (
                <div>
                  <AiOutlinePlus
                    className="cursor-pointer text-blue-500"
                    size={24}
                    onClick={addDescription}
                  />
                </div>
              )}
            </div>
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
