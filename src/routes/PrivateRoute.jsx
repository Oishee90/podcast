/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function PrivateRoute({ children, allowedRoles }) {
  const accessToken = useSelector((state) => state.auth?.access_token);

  const user = useSelector((state) => state.auth?.user);



  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}