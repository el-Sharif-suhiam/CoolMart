import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
// راجع هذا المكون
function AdminOnlyRoute() {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo.isAdmin ? <Outlet /> : <Navigate to="/login" />;
}

export default AdminOnlyRoute;
