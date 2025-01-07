import React from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/utils/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/UI/CheckoutSteps";

function Shipping() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const [fullAddress, setFullAddress] = React.useState({
    address: shippingAddress?.address || "",
    city: shippingAddress?.city || "",
    postalCode: shippingAddress?.postalCode || "",
    country: shippingAddress?.country || "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();
    dispatch(saveShippingAddress(fullAddress));
    navigate("/payment");
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Your Address"
            value={fullAddress.address}
            required
            onChange={(e) =>
              setFullAddress({ ...fullAddress, address: e.target.value })
            }
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Your City"
            required
            value={fullAddress.city}
            onChange={(e) =>
              setFullAddress({ ...fullAddress, city: e.target.value })
            }
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="postalCode">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Your Postal Code"
            required
            value={fullAddress.postalCode}
            onChange={(e) =>
              setFullAddress({ ...fullAddress, postalCode: e.target.value })
            }
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Your Country"
            required
            value={fullAddress.country}
            onChange={(e) =>
              setFullAddress({ ...fullAddress, country: e.target.value })
            }
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary" className="my-2">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default Shipping;
