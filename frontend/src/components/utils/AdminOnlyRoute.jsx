import { Outlet, Navigate } from "react-router-dom";
import { useIsUserAdminQuery } from "../../slices/usersApiSlice";
import Loader from "../utils/Loader";
function AdminOnlyRoute() {
  const { data: isAdmin, isLoading } = useIsUserAdminQuery();
  return isLoading ? (
    <Loader />
  ) : isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
}

export default AdminOnlyRoute;
