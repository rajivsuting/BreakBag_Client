// AllRoutes.jsx
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import ProtectedRoute from '../context/ProtectedRoute'; // Adjust the path as needed
import SignIn from '../pages/Signin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import TravelSummery from '../pages/TravelSummery';
import Acitivities from '../pages/Acitivities';
import Inclusion from '../pages/Inclusion';
import Exclusion from '../pages/Exclusion';
import Transfer from '../pages/Transfer';
import OtherInformation from '../pages/OtherInformation';
import Agents from '../pages/Agents';
import Destination from '../pages/Destination';
import Travellers from '../pages/Travellers';
import Quote from '../pages/Quote';
import AddQuote from '../components/AddQuote';
import QuoteDetail from '../pages/QuoteDetail';
import CreateItinary from '../pages/CreateItinary';
import TeamLead from "../pages/TeamLead";
import Agentroutes from "../pages/Agentroutes";
import { useEffect, useState } from "react";
import { serverUrl } from "../api";
import axios from "axios";
import { toast } from "react-toastify";

const AllRoutes = () => {
  const [role, setRole] = useState(localStorage.getItem('userRole') || '');
  const isAuthenticated = !!role;
  const navigate = useNavigate();
  let location = useLocation();

  const handleValidateToken = async () => {
    try {
      await axios.get(`${serverUrl}/api/validateToken`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data.message || "Something went wrong";

        switch (status) {
          case 400:
            // toast.error(`Bad Request: ${errorMessage}`);
            localStorage.clear();
            navigate("/signin");
            break;
          case 401:
            // toast.error("Unauthorized: Please log in.");
               localStorage.clear();
            navigate("/signin");
            break;
          case 403:
            // toast.error("Forbidden: You do not have permission to perform this action.");
               localStorage.clear();
            navigate("/signin");
            break;
          case 404:
            // toast.error("Not Found: The requested resource could not be found.");
               localStorage.clear();
            navigate("/signin");
            break;
          case 500:
            // toast.error("Server Error: Please try again later.");
               localStorage.clear();
            navigate("/signin");
            break;
          default:
            // toast.error(`Error: ${errorMessage}`);
            localStorage.clear();
            navigate("/signin");
        }
      } else if (error.request) {
        toast.error("Network Error: No response received from the server.");
      } else {
        toast.error(`Error: ${error.message}`); 
      }
    }
  };

  function getPageNameFromURL() {
    // Regex pattern to match the page name
    const pattern = /([^\/?]+)/;

    // Extract the page name using regex match
    const match = location?.pathname?.match(pattern);

    // Check if match found
    if (match && match.length > 1) {
      // Return the matched page name
      return match[1];
    } else {
      // If no match found, return null
      return null;
    }
  }


  useEffect(() => {
    if (getPageNameFromURL() !== "signin"){
      handleValidateToken();
    }
  }, [getPageNameFromURL]);

  return (
    <Routes> 
      <Route path="/signin" element={<SignIn />} />

      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/quote" /> : <Navigate to="/signin" />} 
      />
      <Route 
        path="/quote" 
        element={
          <Quote />
          // <ProtectedRoute role={role} allowedRoles={['Admin', 'Agent', "Team Lead"]}>
          // </ProtectedRoute>
        } 
      />

      <Route 
        path="/travel-summery" 
        element={
          <ProtectedRoute role={role} allowedRoles={['Admin']}>
            <TravelSummery />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/activity" 
        element={
          <ProtectedRoute role={role} allowedRoles={['Admin']}>
            <Acitivities />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/inclusion" 
        element={
          <ProtectedRoute role={role} allowedRoles={['Admin']}>
            <Inclusion />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/exclusion" 
        element={
          <ProtectedRoute role={role} allowedRoles={['Admin']}>
            <Exclusion />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transfer" 
        element={
          <ProtectedRoute role={role} allowedRoles={['Admin']}>
            <Transfer />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/other-information" 
        element={
          <ProtectedRoute role={role} allowedRoles={['Admin']}>
            <OtherInformation />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/agent" 
        element={
          <ProtectedRoute role={role} allowedRoles={['Admin', "Team Lead"]}>
            <Agents />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/destination" 
        element={
          <ProtectedRoute role={role} allowedRoles={['Admin']}>
            <Destination />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/quote" 
        element={
          <ProtectedRoute role={role} allowedRoles={['Admin', 'Agent', "Team Lead"]}>
            <Quote />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/travellers" 
        element={
          <ProtectedRoute role={role} allowedRoles={['Agent', 'Admin']}>
            <Travellers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/add-quote" 
        element={
          <ProtectedRoute role={role} allowedRoles={['Agent', 'Admin', "Team Lead"]}>
            <AddQuote />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/quote-detail/:tripid" 
        element={
          <ProtectedRoute role={role} allowedRoles={['Agent', 'Admin', "Team Lead"]}>
            <QuoteDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-intinary/:tripid" 
        element={
          <ProtectedRoute role={role} allowedRoles={['Agent', 'Admin', "Team Lead"]}>
            <CreateItinary />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/agent-details/:userid" 
        element={
          <ProtectedRoute role={role} allowedRoles={['Admin', "Team Lead"]}>
            <Agentroutes />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AllRoutes;
