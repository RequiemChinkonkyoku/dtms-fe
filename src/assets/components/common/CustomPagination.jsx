import React from "react";
import { TextField, MenuItem } from "@mui/material";

const CustomPagination = ({
  count,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const pageCount = Math.ceil(count / rowsPerPage);
  const startItem = page * rowsPerPage + 1;
  const endItem = Math.min((page + 1) * rowsPerPage, count);

  const handlePageClick = (newPage) => {
    onPageChange(null, newPage);
  };

  return (
    <div className="d-flex justify-content-end align-items-center gap-3">
      <TextField
        select
        label="Rows per page"
        value={rowsPerPage}
        onChange={onRowsPerPageChange}
        variant="outlined"
        size="small"
        style={{ minWidth: "120px" }}
      >
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={25}>25</MenuItem>
      </TextField>
      <ul className="pagination" style={{ marginBottom: "0" }}>
        <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
          <a
            className="page-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(0);
            }}
            aria-label="First"
          >
            <span aria-hidden="true">
              <i className="fa fa-angle-double-left" aria-hidden="true"></i>
              <i
                className="fa fa-angle-double-left"
                aria-hidden="true"
                style={{ marginLeft: "-13px" }}
              ></i>
            </span>
          </a>
        </li>
        <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
          <a
            className="page-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(page - 1);
            }}
            aria-label="Previous"
          >
            <span aria-hidden="true">
              <i className="fa fa-angle-double-left" aria-hidden="true"></i>
            </span>
          </a>
        </li>

        <li className="page-item disabled">
          <span className="page-link">
            {startItem}-{endItem} of {count}
          </span>
        </li>

        <li className={`page-item ${page >= pageCount - 1 ? "disabled" : ""}`}>
          <a
            className="page-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(page + 1);
            }}
            aria-label="Next"
          >
            <span aria-hidden="true">
              <i className="fa fa-angle-double-right" aria-hidden="true"></i>
            </span>
          </a>
        </li>
        <li className={`page-item ${page >= pageCount - 1 ? "disabled" : ""}`}>
          <a
            className="page-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(pageCount - 1);
            }}
            aria-label="Last"
          >
            <span aria-hidden="true">
              <i className="fa fa-angle-double-right" aria-hidden="true"></i>
              <i
                className="fa fa-angle-double-right"
                aria-hidden="true"
                style={{ marginLeft: "-13px" }}
              ></i>
            </span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default CustomPagination;
