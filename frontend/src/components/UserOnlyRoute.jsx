import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
// راجع هذا المكون
function UserOnlyRoute() {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" />;
}

export default UserOnlyRoute;
