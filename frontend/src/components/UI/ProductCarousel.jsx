import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "../utils/Loader";
import Message from "../utils/Message";
import { useGetTopProductsQuery } from "../../slices/productsApiSlice";
function ProductCarousel() {
  const { data: topProducts, isLoading, error } = useGetTopProductsQuery();
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-dark my-4">
      {topProducts.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image
              src={product.image}
              alt={product.name}
              fluid
              style={{
                maxWidth: "640px",
                height: "500px",
                objectFit: "cover",
              }}
            />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ProductCarousel;
