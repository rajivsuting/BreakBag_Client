

// import AgentDashboard from "./components/AgentDashboard";

import { AccordionProvider } from "./context/AccordionContext";
import AllRoutes from "./routes/AllRoutes";

function App() {
  const apiKey = 'AIzaSyDzRH7D5s3eU5EBEPsfB0jhCWCQAwn2zvM'; // Replace with your API key
const location = '37.7749,-122.4194'; // Example: San Francisco latitude and longitude
const radius = 5000; // Search within 5000 meters
const type = 'lodging'; // Type of place (hotel)

const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data.results); // Handle the results here
  })
  .catch(error => {
    console.error('Error:', error);
  });
  return (
    <div>
      <AccordionProvider>
      <AllRoutes/>
      </AccordionProvider>
    </div>
  );
}

export default App;
