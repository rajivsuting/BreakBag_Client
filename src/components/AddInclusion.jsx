import { Button, Input, Textarea } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { serverUrl } from "../api";
import Select from "react-select";

const AddInclusion = ({ isOpen, onClose, getAlldata }) => {
  // State to manage form inputs
  const [items, setItems] = useState([{ title: "", description: [""] }]); // Description is now an array
  const [images, setImages] = useState([]); // State to handle multiple images
  const [isLoading, setIsLoading] = useState(false);
  const [destinationAll, setDestinationAll] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");

  useEffect(() => {
    axios.get(`${serverUrl}/api/destination/destinaions`).then((res) => {
      setDestinationAll(res.data.data);
    });

    return () => {
      console.log("");
    };
  }, []);

  if (!isOpen) return null;

  // Handle form input changes for dynamic items
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
  };

  // Handle description input changes (multiple descriptions for each item)
  const handleDescriptionChange = (itemIndex, descIndex, e) => {
    const value = e.target.value;
    const updatedItems = [...items];
    updatedItems[itemIndex].description[descIndex] = value;
    setItems(updatedItems);
  };

  // Add a new empty description field for a specific item
  const addDescription = (itemIndex) => {
    const updatedItems = [...items];
    updatedItems[itemIndex].description.push(""); // Add empty string for new description
    setItems(updatedItems);
  };

  // Remove a specific description field
  const removeDescription = (itemIndex, descIndex) => {
    const updatedItems = [...items];
    updatedItems[itemIndex].description = updatedItems[itemIndex].description.filter(
      (_, i) => i !== descIndex
    );
    setItems(updatedItems);
  };

  // Handle image input changes
  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  // Add new title and description fields
  const addItem = () => {
    setItems([...items, { title: "", description: [""] }]); // Start with an empty description array
  };

  // Remove title and description fields
  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    setIsLoading(true);

    const data = new FormData();

    // Append items (title and description)
    data.append("itemList", JSON.stringify(items));
    data.append("destination", selectedDestination);

    // Append multiple images
    if (images.length > 0) {
      Array.from(images).forEach((image) => {
        data.append("images", image);
      });
    }

    console.log(data);

    try {
      // API call to submit form data
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

      // Reset form after successful submission
      setItems([{ title: "", description: [""] }]); // Reset description to array
      setImages([]);
      setSelectedDestination("");
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const options = destinationAll.map((destination) => ({
    value: destination._id,
    label: destination.title,
  }));

  return (
    <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative m-4 w-3/5 max-w-[90%] max-h-[90vh] overflow-y-auto rounded-lg bg-white text-blue-gray-500 shadow-2xl p-8">
        <div className="flex items-center justify-end font-sans text-2xl font-semibold text-blue-gray-900">
          <AiOutlineClose
            className="cursor-pointer"
            size={24}
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-xl font-normal">Add Inclusion</div>

          {/* File input for uploading multiple images */}
          <div className="flex items-center gap-5">
            <div className="w-[100%]">
              {/* react-select component */}
              <Select
                options={options} // The options fetched from API
                value={options.find(
                  (option) => option.value === selectedDestination
                )} // Pre-select the value if needed
                onChange={(selectedOption) =>
                  setSelectedDestination(selectedOption?.value || "")
                }
                placeholder="Select a destination"
                isSearchable={true}
                isClearable={true} // Allows clearing the selection
              />
            </div>
            <Input
              label="Upload Images"
              type="file"
              name="images"
              onChange={handleImageChange}
              multiple
              required
            />
          </div>

          {/* Dynamic input fields for Title and Description */}
          {items.map((item, itemIndex) => (
            <div key={itemIndex} className="space-y-4">
              <div className="flex gap-5">
                <Input
                  label={`Title ${itemIndex + 1}`}
                  name="title"
                  value={item.title}
                  onChange={(e) => handleItemChange(itemIndex, e)}
                  required
                />
                {itemIndex === 0 ? (
                  <AiOutlinePlus
                    className="cursor-pointer"
                    size={24}
                    onClick={addItem}
                  />
                ) : null}
                {
                  itemIndex > 0 ?
                  (
                    <AiOutlineClose
                      className="cursor-pointer text-red-500"
                      size={24}
                      onClick={() => removeItem(itemIndex)}
                    />
                  ) : null
                }
              </div>

              {item.description.map((desc, descIndex) => (
                <div key={descIndex} className="flex gap-5">
                  <Textarea
                    label={`Description ${itemIndex + 1}.${descIndex + 1}`}
                    value={desc}
                    onChange={(e) => handleDescriptionChange(itemIndex, descIndex, e)}
                    required
                  />
                  <div className="flex items-center">
                    {descIndex === 0 ? (
                      <AiOutlinePlus
                        className="cursor-pointer"
                        size={24}
                        onClick={() => addDescription(itemIndex)}
                      />
                    ) : (
                      <AiOutlineClose
                        className="cursor-pointer text-red-500"
                        size={24}
                        onClick={() => removeDescription(itemIndex, descIndex)}
                      />
                    )}
                  </div>
                </div>
              ))}
              <hr />
            </div>
          ))}

          {/* Submit button */}
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
