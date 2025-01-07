import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import CheckoutSteps from "../components/UI/CheckoutSteps.jsx";
import { toast } from "react-toastify";
import {
  useCreateOrderMutation,
  useGetPaymentStatusMutation,
  usePayOrderMutation,
} from "../slices/orderApiSlice.js";
import { clearCartItems } from "../slices/cartSlice";
//import { useGetStripeUrlMutation } from "../slices/orderApiSlice";
import Message from "../components/utils/Message.jsx";
import Loader from "../components/utils/Loader.jsx";

function PlaceOrder() {
  const [search] = useSearchParams();

  const [status, setStatus] = React.useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  //const { cartItems } = cart;
  // const [getStripeUrl, { isLoading: stripeLoading, error: stripeError }] =
  //   useGetStripeUrlMutation();

  const [getPaymentStatus] = useGetPaymentStatusMutation();

  React.useEffect(() => {
    const sessionId = search.get("session_id");
    async function getStatus() {
      const status = await getPaymentStatus({ sessionId });
      setStatus(status.data.status);
    }
    getStatus();
  }, []);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  React.useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress.address, navigate]);

  async function PlaceOrderHandler() {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: "card",
        itemsPrice: cart.itemsPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      if (!res || !res._id) {
        throw new Error("Failed to create order.");
      }
      if (status === "complete") {
        const order = await payOrder({ orderId: res._id });
        if (order.data.isPaid) {
          toast.success("Order paid successfully");
          dispatch(clearCartItems());
          navigate(`/order/${res._id}`);
        } else {
          throw new Error("Payment not completed.");
        }
      }
    } catch (error) {
      toast.error(error?.data?.message || error);
    }
  }
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              Credit Card
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row>
                        <Col
                          md={1}
                          style={{ minWidth: "70px", maxWidth: "150px" }}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>Free</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>$0.00</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {error && <Message variant="danger">{error}</Message>}
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems === 0}
                  onClick={PlaceOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && loadingPay && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default PlaceOrder;
