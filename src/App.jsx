// App.jsx
import React from 'react';
import { AccordionProvider } from './context/AccordionContext';
import { BrowserRouter as Router } from 'react-router-dom';
import AllRoutes from './routes/AllRoutes';
import Sidebar from './components/Sidebar'; // Adjust the path accordingly
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <AccordionProvider>
        <Router>
          <Sidebar /> {/* Sidebar component */}
          <div className="ml-64"> {/* Adjust margin for sidebar */}
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
