import React, { useState } from "react";
import axios from "axios";

const NearbyHotels = () => {
  const [place, setPlace] = useState("");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const googleApiKey = "AIzaSyBSDhdL2tinLiAKRk7w9JhDAv5gAQXFMIk"; // Replace with your Google API key

  // Handle input change
  const handlePlaceChange = (e) => {
    setPlace(e.target.value);
  };

  // Fetch latitude and longitude of the entered place
  const fetchCoordinates = async () => {
    setLoading(true);
    setError(null);
    console.log(place)
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${googleApiKey}`;

    try {
      const response = await axios.get(geocodeUrl);
      console.log(response);
      if (response.data.status === "OK") {
        const location = response.data.results[0].geometry.location;
        const latitude = location.lat;
        const longitude = location.lng;
        
        // Fetch nearby hotels using the latitude and longitude
        fetchNearbyHotels(latitude, longitude);
      } else {
        setError("Place not found.");
      }
    } catch (err) {
        console.log(err)
      setError("Failed to fetch place coordinates.");
    }

    setLoading(false);
  };

  // Fetch nearby hotels using the Google Places API
  const fetchNearbyHotels = async (latitude, longitude) => {
    console.log("jdhdh1")
    console.log(latitude,
        longitude);
    setLoading(true);
    setError(null);

    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=lodging&key=${googleApiKey}`;
    try {
      const response = await axios.get(placesUrl);
      console.log(response);
      if (response.data.status === "OK") {
        
        setHotels(response.data.results);
      } else {
        setError("No hotels found nearby.");
      }
    } catch (err) {
        console.log(err)
      setError("Failed to fetch nearby hotels.");
    }

    setLoading(false);
  };

  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Find Nearby Hotels</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 w-full mb-2"
          placeholder="Enter a place (e.g., New York, London)"
          value={place}
          onChange={handlePlaceChange}
        />
        <button
          onClick={fetchCoordinates}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Search Hotels
        </button>
      </div>

      {/* Loading state */}
      {loading && <div>Loading hotels...</div>}

      {/* Display the list of hotels */}
      <div className="hotel-list">
        {hotels.length > 0 ? (
          hotels.map((hotel, index) => (
            <div
              key={index}
              className="border p-4 mb-4 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold">{hotel.name}</h2>
              <p>Rating: {hotel.rating || "N/A"}</p>
              <p>{hotel.vicinity}</p>
            </div>
          ))
        ) : (
          !loading && <div>No hotels found for this place.</div>
        )}
      </div>
    </div>
  );
};

export default NearbyHotels;
