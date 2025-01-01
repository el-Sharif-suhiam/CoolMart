import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadImageMutation,
} from "../../slices/productsApiSlice";

function ProductEdit() {
  const { id: productId } = useParams();
  const [productData, setProductData] = React.useState({
    name: "",
    price: 0,
    image: "",
    brand: "",
    category: "",
    countInStock: 0,
    description: "",
  });

  const {
    data: oldProduct,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: updateLoading, error: updateError }] =
    useUpdateProductMutation();

  const [uploadImage, { isLoading: uploadLoading, error: uploadError }] =
    useUploadImageMutation();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (oldProduct) {
      setProductData({
        name: oldProduct.name,
        price: oldProduct.price,
        image: oldProduct.image,
        brand: oldProduct.brand,
        category: oldProduct.category,
        countInStock: oldProduct.countInStock,
        description: oldProduct.description,
      });
    }
  }, [oldProduct]);

  async function submitHandler(e) {
    e.preventDefault();
    try {
      const res = await updateProduct({
        _id: productId,
        ...productData,
      }).unwrap();
      toast.success("Product Updated");
      refetch();
      navigate("/admin/productslist");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
      navigate("/admin/productslist");
    }
  }

  async function uploadImageHandler(e) {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadImage(formData).unwrap();
      toast.success(res.message);
      setProductData({ ...productData, image: res.path });
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

      <FormContainer>
        <h1>Edit Product</h1>
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
                value={productData.name}
                onChange={(e) =>
                  setProductData({ ...productData, name: e.target.value })
                }
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter The Price"
                value={productData.price}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    price: e.target.value,
                  })
                }
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="image">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Image URL"
                value={productData.image}
                onChange={(e) =>
                  setProductData({ ...productData, image: e.target.value })
                }
              ></Form.Control>
              <Form.Control
                type="file"
                lable="Choose File"
                onChange={uploadImageHandler}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter The Brand"
                value={productData.brand}
                onChange={(e) =>
                  setProductData({ ...productData, brand: e.target.value })
                }
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter The Category"
                value={productData.category}
                onChange={(e) =>
                  setProductData({ ...productData, category: e.target.value })
                }
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Count In Stock"
                value={productData.countInStock}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    countInStock: e.target.value,
                  })
                }
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter The Description"
                value={productData.description}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    description: e.target.value,
                  })
                }
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="my-3">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
}

export default ProductEdit;
