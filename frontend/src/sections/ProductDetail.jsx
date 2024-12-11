import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Rating from "../components/Rating";
function ProductDetail() {
  const params = useParams();
  const [theProduct, setTheProduct] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/product/${params.id}`);
        setTheProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [params]);

  return (
    <>
      <Link className="btn btn-outline-secondary my-3" to="/">
        Go Back
      </Link>
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
              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={theProduct.countInStock === 0 ? true : false}
                >
                  Add to cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default ProductDetail;
