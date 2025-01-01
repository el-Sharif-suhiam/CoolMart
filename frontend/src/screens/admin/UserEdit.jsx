import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { useSelector } from "react-redux";

import { toast } from "react-toastify";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";
import { FaCheck } from "react-icons/fa";

function UserEdit() {
  const { id: userId } = useParams();
  const [userData, setUserData] = React.useState({
    name: "",
    email: "",
    isAdmin: false,
  });

  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: userOldData,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: updateLoading, error: updateError }] =
    useUpdateUserMutation();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (userOldData) {
      setUserData({
        name: userOldData.name,
        email: userOldData.email,
        isAdmin: userOldData.isAdmin,
      });
    }
  }, [userOldData]);

  async function submitHandler(e) {
    e.preventDefault();
    try {
      await updateUser({
        _id: userId,
        ...userData,
      }).unwrap();
      toast.success("User has been updated");
      refetch();
      navigate("/admin/userslist");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
      navigate("/admin/userslist");
    }
  }

  return (
    <>
      <button
        className="btn btn-outline-secondary my-3"
        onClick={() => window.navigation.back()}
      >
        Go Back
      </button>

      <FormContainer>
        <h1>Edit User</h1>
        {updateLoading && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter The Name"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter The Email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    email: e.target.value,
                  })
                }
              ></Form.Control>
            </Form.Group>
            {userInfo._id !== userId ? (
              <Form.Group className="my-2" controlId="isAdmin">
                <Form.Check
                  type="checkbox"
                  label="Is Admin"
                  checked={userData.isAdmin}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      isAdmin: e.target.checked,
                    })
                  }
                ></Form.Check>
              </Form.Group>
            ) : (
              <Form.Group className="my-2" controlId="isAdmin">
                <FaCheck style={{ color: "green", marginRight: "5px" }} /> you
                are an Admin
              </Form.Group>
            )}

            {updateError && (
              <Message variant="danger">
                {updateError?.data?.message || updateError.error}
              </Message>
            )}
            <Button type="submit" variant="primary" className="my-3">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
}

export default UserEdit;
