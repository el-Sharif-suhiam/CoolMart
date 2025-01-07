import { Link, useParams } from "react-router-dom";
import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
} from "../slices/orderApiSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Loader from "../components/utils/Loader";
import Message from "../components/utils/Message";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";

function OrderScreen() {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  const [deliverOrder, { isLoading: deliverLoading }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  async function deliverOrderHandler() {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("order marked as delivered");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.message || error?.error}</Message>
  ) : (
    <>
      <h2>Order: {truncateMiddle(order._id, 5, 4)}</h2>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name:</strong> {order.user.name}
              </p>
              <p>
                <strong>Email:</strong> {order.user.email}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item) => (
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
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
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
                  <Col>${order.itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>Shipping</Col>
                  <Col>Free</Col>
                </Row>
                <Row>
                  <Col>Tax</Col>
                  <Col>$0.00</Col>
                </Row>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {deliverLoading && <Loader />}

              {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={deliverOrderHandler}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

function truncateMiddle(text, startLength, endLength) {
  if (text.length <= startLength + endLength) return text;
  const start = text.slice(0, startLength);
  const end = text.slice(-endLength);
  return `${start}.........${end}`;
}
export default OrderScreen;
