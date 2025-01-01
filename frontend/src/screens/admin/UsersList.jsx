import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
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
        console.log(res);
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
      )}
    </>
  );
}

export default UsersList;
