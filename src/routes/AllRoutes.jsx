import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import { useState } from "react";

// Assuming role is stored in state after sign-in
const App = () => {
  const [role, setRole] = useState(localStorage.getItem('userRole') || ''); // Get role from storage after login

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/signin" element={<SignIn />} />

        {/* Admin Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute role={role} allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
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
            <ProtectedRoute role={role} allowedRoles={['Admin']}>
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
            <ProtectedRoute role={role} allowedRoles={['Admin']}>
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
            <ProtectedRoute role={role} allowedRoles={['Agent', 'Admin']}>
              <AddQuote />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/quote-detail/:tripid" 
          element={
            <ProtectedRoute role={role} allowedRoles={['Agent', 'Admin']}>
              <QuoteDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-intinary/:tripid" 
          element={
            <ProtectedRoute role={role} allowedRoles={['Agent', 'Admin']}>
              <CreateItinary />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
