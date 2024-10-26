// App.jsx
import { useEffect, useState } from "react";
import { AccordionProvider } from "./context/AccordionContext";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router } from "react-router-dom";
import AllRoutes from "./routes/AllRoutes"; // Adjusted import path as needed
import "react-toastify/dist/ReactToastify.css"; // Include CSS for toast notifications

function App() {
  return (
    <div>
      <AccordionProvider>
        <Router>
          <AllRoutes />
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
