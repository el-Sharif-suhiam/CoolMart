import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import Message from "../../components/utils/Message";
import Loader from "../../components/utils/Loader";
import {
  useGetusersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";

function UsersList() {
  const { data: users, refetch, isLoading, error } = useGetusersQuery();

  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

  async function userDeleteHandler(id) {
    if (window.confirm("are you sure you want to delete this user?")) {
      try {
        const res = await deleteUser(id);
        refetch();
        toast.success(res.data?.message);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  }
  return (
    <>
      <h1>Users List</h1>

      {deleteLoading && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div
          className="table-responsive "
          style={{ overflowX: "auto", minHeight: "70vh" }}
        >
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}> {user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>

                  <td>
                    <Link to={`/admin/user/${user._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <FaEdit />
                      </Button>
                    </Link>
                    <Button
                      variant="light"
                      className="btn-sm"
                      onClick={() => userDeleteHandler(user._id)}
                    >
                      <FaTrash style={{ color: "red" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}

export default UsersList;
