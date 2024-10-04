import { Button, Input, Textarea } from "@material-tailwind/react";
import React, { useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { serverUrl } from "../api";

const AddOtherinformation = ({ isOpen, onClose, getAlldata }) => {
  // State to manage form inputs
  const [items, setItems] = useState([{ title: "", description: "" }]); // Initially 1 item
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Handle form input changes for dynamic items
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
  };

  // Add new title and description fields
  const addItem = () => {
    setItems([...items, { title: "", description: "" }]);
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

    const data = { itemList: items };

    try {
      // API call to submit form data
      const response = await axios.post(
        `${serverUrl}/api/other-information/other-information/create`,
        data
      );
      console.log("Response:", response.data);
      alert("Other Information added successfully");
      getAlldata();

      // Reset form after successful submission
      setItems([{ title: "", description: "" }]);
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };
//   w-[90%] h-[90%] max-h-[90vh]
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
          <div className="text-xl font-normal">Add Other Information</div>

          {/* Dynamic input fields for Title and Description */}
          {items.map((item, index) => (
            <>
              <div key={index} className="flex  gap-5">
                <div className="w-full">
                  <Input
                    label={`Title ${index + 1}`}
                    name="title"
                    value={item.title}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                  <div className="mt-3">
                    <Textarea
                      label={`Description ${index + 1}`}
                      name="description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </div>
                </div>
                {index === 0 ? (
                  <AiOutlinePlus
                    className="cursor-pointer"
                    size={24}
                    onClick={addItem}
                  />
                ) : (
                  <AiOutlineClose
                    className="cursor-pointer text-red-500"
                    size={24}
                    onClick={() => removeItem(index)}
                  />
                )}
              </div>
              <hr />
            </>
          ))}

          {/* Submit button */}
          <div className="flex justify-center">
            <Button className="bg-main" type="submit" disabled={isLoading}>
              {isLoading ? "Adding Other Information..." : "Add Other Information"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOtherinformation;
