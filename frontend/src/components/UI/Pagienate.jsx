/* eslint-disable react/prop-types */

import { Link, useSearchParams } from "react-router-dom";
import { Pagination } from "react-bootstrap";
function Pagienate({ totalPages, currentPage, isAdmin = false }) {
  const [searchParams] = useSearchParams();
  const limit = searchParams.get("limit");
  const search = searchParams.get("search");
  return (
    <Pagination style={{ justifyContent: "center", marginTop: "20px" }}>
      {[...Array(totalPages).keys()].map((x) => (
        <Pagination.Item
          as={Link}
          key={x + 1}
          to={
            !isAdmin
              ? `/?page=${x + 1}${limit ? `&limit=${limit}` : ""}${
                  search ? `&search=${search}` : ""
                }`
              : `/admin/productsList?page=${x + 1}${
                  limit ? `&limit=${limit}` : ""
                }${search ? `&search=${search}` : ""}`
          }
          active={x + 1 === currentPage}
        >
          {x + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  );
}

export default Pagienate;
