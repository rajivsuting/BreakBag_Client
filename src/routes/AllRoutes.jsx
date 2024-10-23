import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ProtectedRoute from '../context/ProtectedRoute'; // The component we just created
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
import { useEffect, useState } from "react";
import TeamLead from "../pages/TeamLead";
import Agentroutes from "../pages/Agentroutes";
import { serverUrl } from "../api";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [role, setRole] = useState(localStorage.getItem('userRole') || ''); // Get role from storage after login
  const isAuthenticated = !!role; // Check if user is authenticated (role is set)
  // const navigate = useNavigate();

  const handleValidateToken = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/validateToken`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        const status = error.response.status;
        const errorMessage =
          error.response.data.message || "Something went wrong";

        // Show custom error messages based on status codes
        switch (status) {
          case 400:
            toast.error(`Bad Request: ${errorMessage}`);
            // navigate("/signin")
            break;
          case 401:
            toast.error("Unauthorized: Please log in again.");
            // navigate("/signin")
            break;
          case 403:
            toast.error(
              "Forbidden: You do not have permission to perform this action."
            );
            // navigate("/signin")
            break;
          case 404:
            toast.error(
              "Not Found: The requested resource could not be found."
            );
            // navigate("/signin")
            break;
          case 500:
            toast.error("Server Error: Please try again later.");
            // navigate("/signin")
            break;
          default:
            toast.error(`Error: ${errorMessage}`);
            // navigate("/signin")
        }
      } else if (error.request) {
        // Network error (no response received)
        toast.error("Network Error: No response received from the server.");
      } else {
        // Something else happened
        toast.error(`Error: ${error.message}`);
      }
    } finally {
    }
  };

  useEffect(() => {
    handleValidateToken();

    return () => {
      console.log("done");
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/signin" element={<SignIn />} />

        {/* Redirect base URL to /signin if not logged in */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/quote" /> : <Navigate to="/signin" />} 
        />

        {/* Protected Routes */}
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

        {/* Default Route */}
        <Route 
          path="/quote" 
          element={
            <ProtectedRoute role={role} allowedRoles={['Admin', 'Agent', "Team Lead"]}>
              <Quote />
            </ProtectedRoute>
          } 
        />

        {/* Agent Routes */}
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
    </Router>
  );
};

export default App;
