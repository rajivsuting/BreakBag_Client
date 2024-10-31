// App.jsx
import React, { useEffect, useState } from "react";
import { AccordionProvider } from "./context/AccordionContext";
import { BrowserRouter as Router } from "react-router-dom";
import AllRoutes from "./routes/AllRoutes";
import Sidebar from "./components/Sidebar"; // Adjust the path accordingly
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // let location = useLocation();
  const [test, setTest] = useState(false)

  function getPageNameFromURL() {
    const fullPath = window.location.pathname;

    // Split the path and get the last segment (endpoint)
    const endpoint = fullPath.split('/').filter(Boolean).pop();
    return endpoint
  }

  useEffect(()=>{
    if (getPageNameFromURL() !== "signin"){
      setTest(true)
    }
  },[getPageNameFromURL,test])
  return (
    <div>
      <AccordionProvider>
        <Router>
        <Sidebar />
          <div className={`${test ? "ml-64" : 'ml-0'}`}>
            {" "}
            {/* Adjust margin for sidebar */}
            <AllRoutes />
          </div>
        </Router>
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
