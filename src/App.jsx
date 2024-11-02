import React, { useEffect, useState } from "react";
import { AccordionProvider } from "./context/AccordionContext";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AllRoutes from "./routes/AllRoutes";
import Sidebar from "./components/Sidebar"; // Adjust the path accordingly
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  const location = useLocation(); // Now it's inside the Router context
  const [test, setTest] = useState(false);

  const getPageNameFromURL = () => {
    const fullPath = window.location.pathname;
    const endpoint = fullPath.split("/").filter(Boolean).pop();
    return endpoint;
  };

  useEffect(() => {
    if (getPageNameFromURL() !== "signin") {
      setTest(true);
    }
    console.log(getPageNameFromURL());
  }, [location]); // Using location as a dependency

  return (
    <>
      <Sidebar />
      <div className={`${test || getPageNameFromURL() !== "signin" ? "ml-64" : "ml-0"}`}>
        <AllRoutes />
      </div>
    </>
  );
}

function App() {
  return (
    <AccordionProvider>
      <Router>
        <AppContent /> {/* Separate component to use hooks */}
      </Router>
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
    </AccordionProvider>
  );
}

export default App;
