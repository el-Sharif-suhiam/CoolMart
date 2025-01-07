import { Link, useSearchParams } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/utils/Message";
import Loader from "../../components/utils/Loader";
import { toast } from "react-toastify";
import Pagienate from "../../components/UI/Pagienate";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";

function ProductsList() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    page,
    limit,
    search: searchParams.get("search") || "",
  });
  const [createProduct, { isLoading: createLoading }] =
    useCreateProductMutation();
  const [deleteProduct, { isLoading: deleteLoading }] =
    useDeleteProductMutation();

  async function productDeleteHandler(id) {
    if (window.confirm("are you sure you want to delete this product?")) {
      try {
        const res = await deleteProduct(id);
        refetch();
        toast.success(res.data?.message);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  }

  async function createProductHandler() {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct();
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  }
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3" onClick={createProductHandler}>
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
      {createLoading && <Loader />}
      {deleteLoading && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          Error: {error.status} - {error.data?.message}
        </Message>
      ) : (
        <>
          <div
            className="table-responsive "
            style={{ overflowX: "auto", minHeight: "70vh" }}
          >
            <Table striped hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button
                        variant="light"
                        className="btn-sm"
                        onClick={() => productDeleteHandler(product._id)}
                      >
                        <FaTrash style={{ color: "red" }} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Pagienate
            totalPages={data.pagesTotalNum}
            currentPage={data.pageNumber}
            isAdmin={true}
            limit={limit}
            search={searchParams.get("search") || ""}
          />
        </>
      )}
    </>
  );
}

export default ProductsList;
