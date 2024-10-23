// import AgentDashboard from "./components/AgentDashboard";
import { useEffect, useState } from "react";
import { AccordionProvider } from "./context/AccordionContext";
import axios from "axios";

import { ToastContainer } from "react-toastify";
import { serverUrl } from "./api";
import { useNavigate } from "react-router-dom";
import Allroutes from "./routes/AllRoutes"

function App() {
  // const navigate = useNavigate();
  

  return (
    <div>
      <AccordionProvider>
        <Allroutes/>
      </AccordionProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function App() {
//   const [place, setPlace] = useState(""); // Store user's place input
//   const [location, setLocation] = useState(null); // Store geocoded location
//   const [hotels, setHotels] = useState([]); // Store list of hotels
//   const [error, setError] = useState(null); // Handle errors

//   // Geocode the place name entered by the user
//   const geocodePlace = async () => {
//     const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=AIzaSyBSDhdL2tinLiAKRk7w9JhDAv5gAQXFMIk`;

//     try {
//       const response = await axios.get(geocodeUrl);
//       const results = response.data.results;

//       if (results.length > 0) {
//         const { lat, lng } = results[0].geometry.location;
//         setLocation(`${lat},${lng}`);
//       } else {
//         setError("Place not found");
//       }
//     } catch (error) {
//       setError("Error geocoding place");
//     }
//   };

//   // console.log(location)

//   // Fetch nearby hotels once location is set
//   useEffect(() => {
//     if (location) {
//       axios
//         .get(`http://localhost:8080/hotels?location=${location}`)
//         .then((response) => {
//           console.log(response)
//           setHotels(response.data);
//         })
//         .catch((error) => {
//           setError("Error fetching hotels");
//         });
//     }
//   }, [location]);

//   const handleSearch = () => {
//     if (place) {
//       geocodePlace(); // Convert place to lat/lng before fetching hotels
//     } else {
//       setError("Please enter a place name");
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Search Nearby Hotels</h1>
//       <input
//         type="text"
//         value={place}
//         onChange={(e) => setPlace(e.target.value)}
//         placeholder="Enter a place name"
//       />
//       <button onClick={handleSearch}>Search</button>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {hotels.length > 0 && (
//         <div>
//           <h2>Nearby Hotels</h2>
//           <ul>
//             {hotels.map((hotel) => (
//               <li key={hotel.place_id}>
//                 <h3>{hotel.name}</h3>
//                 <p>{hotel.vicinity}</p>
//                 <p>Rating: {hotel.rating}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
