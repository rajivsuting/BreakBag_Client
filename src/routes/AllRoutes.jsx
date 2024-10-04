import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import AdminDashboard from "../pages/admin/AdminDashboard";
import TravelSummery from "../pages/TravelSummery";
import SignIn from "../pages/Signin";
import Acitivities from "../pages/Acitivities";
import Inclusion from "../pages/Inclusion";
import Exclusion from "../pages/Exclusion";
import OtherInformation from "../pages/OtherInformation";
import Transfer from "../pages/Transfer";
import Agents from "../pages/Agents";
import Travellers from "../pages/Travellers";
import Destination from "../pages/Destination";
import Quote from "../pages/Quote";

const AllRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/travel-summery" element={<TravelSummery />} />
        <Route path="/activity" element={<Acitivities />} />
        <Route path="/inclusion" element={<Inclusion />} />
        <Route path="/exclusion" element={<Exclusion />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/other-information" element={<OtherInformation />} />
        <Route path="/agent" element={<Agents />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/travellers" element={<Travellers />} />
        <Route path="/quote" element={<Quote />} />
      </Routes>
    </Router>
  );
};

export default AllRoutes;
