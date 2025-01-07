import { Row, Col } from "react-bootstrap";
import Product from "../components/UI/Product";
import { useSearchParams } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Loader from "../components/utils/Loader";
import Message from "../components/utils/Message";
import Pagienate from "../components/UI/Pagienate";
import SearchBox from "../components/UI/SearchBox";
import ProductCarousel from "../components/UI/ProductCarousel";
import Meta from "../components/utils/Meta";
import AboutSection from "../components/UI/About";
function Home() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 8;
  const search = searchParams.get("search") || "";
  const { data, isLoading, error } = useGetProductsQuery({
    page,
    limit,
    search,
  });
  return (
    <>
      <Meta
        title="welcome to coolmart"
        description="Explore our exclusive collection of top-notch products tailored to
              meet your needs. Enjoy seamless shopping, unbeatable prices, and
              fast delivery—all in one place."
      />
      <ProductCarousel />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.message || error?.error}</Message>
      ) : (
        <>
          <div className="d-flex justify-content-between flex-wrap my-3">
            <h1>Latest Products</h1>
            <SearchBox />
          </div>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Pagienate
            totalPages={data.pagesTotalNum}
            currentPage={data.pageNumber}
          />
          <AboutSection />
        </>
      )}
    </>
  );
}

export default Home;
