import React from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

function SearchBox() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [keyword, setKeyword] = React.useState(
    searchParams.get("search") || ""
  );

  function submitHandler(e) {
    e.preventDefault();

    const updatedParams = new URLSearchParams(searchParams);

    // Reset the `search` parameter and remove pagination-related parameters
    updatedParams.delete("page");
    if (keyword.trim()) {
      // Set the new search value
      updatedParams.set("search", keyword);
    } else {
      // Clear the search if empty
      updatedParams.delete("search");
    }
    navigate(`?${updatedParams.toString()}`);
    setKeyword("");
  }

  return (
    <Form
      onSubmit={submitHandler}
      className="d-flex"
      style={{ maxHeight: "45px" }}
    >
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search Products..."
        className="mr-sm-2 ml-sm-5"
      />
      <Button type="submit" variant="outline-success" className="p-2 mx-2">
        Search
      </Button>
    </Form>
  );
}

export default SearchBox;
