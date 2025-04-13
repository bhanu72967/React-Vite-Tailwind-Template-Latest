// ProtectedRoutes.js
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../components/Firebase";

const ProtectedRoutes = () => {
  return auth.currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
