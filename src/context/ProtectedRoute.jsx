import { Navigate } from "react-router-dom";

// Higher-Order Component to protect routes based on role
const ProtectedRoute = ({ role, allowedRoles, children }) => {
  if (!allowedRoles.includes(role)) {
    console.log("role",role, "allowedRoles",allowedRoles)
    // If the role isn't allowed, redirect to the sign-in page (or any other page)
    return <Navigate to="/signin" />;
  }
  return children; // Render the children (route component) if the role is allowed
};

export default ProtectedRoute;
