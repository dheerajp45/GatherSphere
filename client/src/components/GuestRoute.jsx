import { useAuth } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

/** For home/login/register — logged-in users go to event listing. */
function GuestRoute({ children }) {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/eventlisting" replace />;
  }
  return children;
}

export default GuestRoute;
