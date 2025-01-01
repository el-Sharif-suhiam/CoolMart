import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  useGetProductDetailsQuery,
  useAddReviewMutation,
} from "../slices/productsApiSlice";
import { useDispatch, useSelector } from "react-redux";
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
import { toast } from "react-toastify";

function ProductDetail() {
  const params = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productId = params.id;
  const {
    data: theProduct,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(params.id);

  const [addReview, { isLoading: loadingAddReview }] = useAddReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  function addToCartHandler() {
    dispatch(addToCart({ ...theProduct, qty }));
    navigate("/cart");
  }

  async function submitHandler(e) {
    e.preventDefault();
    try {
      await addReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review added successfully");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
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

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.message || error?.error}</Message>
      ) : (
        <>
          {" "}
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
          <Row className="review my-3">
            <Col md={6}>
              <h2>Reviews</h2>
              {theProduct.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {theProduct.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {loadingAddReview && <Loader />}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating" className="my-2">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment" className="my-2">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingAddReview}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default ProductDetail;
