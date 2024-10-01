import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/Signin";
import AdminDashboard from "./components/Sidebar";
import Sidebar from "./components/Sidebar";
// import AgentDashboard from "./components/AgentDashboard";

function App() {
  return (
    <Router>
      {/* <Sidebar /> */}
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* <Route path="/agent-dashboard" element={<AgentDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
