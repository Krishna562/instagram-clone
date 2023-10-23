import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (isAuthenticated) return children;
  else return <Navigate to={"/login"} />;
};

export default ProtectedRoute;
