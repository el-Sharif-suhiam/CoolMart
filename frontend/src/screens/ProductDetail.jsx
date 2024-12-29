import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";
import { useDispatch } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";
function ProductDetail() {
  const params = useParams();
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: theProduct,
    isLoading,
    error,
  } = useGetProductDetailsQuery(params.id);

  function addToCartHandler() {
    dispatch(addToCart({ ...theProduct, qty }));
    navigate("/cart");
  }

  return (
    <>
      <button
        className="btn btn-outline-secondary my-3"
        onClick={() => window.navigation.back()}
      >
        Go Back
      </button>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.message || error?.error}</Message>
      ) : (
        <Row>
          <Col md={5}>
            <Image src={theProduct.image} alt={theProduct.name} fluid />
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{theProduct.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={theProduct.rating}
                  text={`${theProduct.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>Price: ${theProduct.price}</ListGroup.Item>
              <ListGroup.Item>
                Description: {theProduct.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${theProduct.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      <strong
                        className={
                          theProduct.countInStock > 0
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {theProduct.countInStock > 0
                          ? "In Stock"
                          : "Out of Stock"}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {theProduct.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[...Array(theProduct.countInStock).keys()].map(
                            (ele) => (
                              <option key={ele + 1} value={ele + 1}>
                                {ele + 1}
                              </option>
                            )
                          )}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    type="button"
                    disabled={theProduct.countInStock === 0 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}

export default ProductDetail;
