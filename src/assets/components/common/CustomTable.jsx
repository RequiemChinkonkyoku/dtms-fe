import React from "react";
import { TableSortLabel } from "@mui/material";

const CustomTable = ({
  columns,
  data,
  page,
  rowsPerPage,
  orderBy,
  order,
  onSort,
  onRowClick,
  renderActions,
}) => {
  return (
    <table className="table table-hover">
      <thead>
        <tr className="text-info">
          <th className="text-center">#</th>
          {columns.map(({ key, label }) => (
            <th key={key}>
              <TableSortLabel
                active={orderBy === key}
                direction={orderBy === key ? order : "asc"}
                onClick={() => onSort && onSort(key)}
                className={orderBy === key ? "text-warning" : "text-info"}
              >
                {label}
              </TableSortLabel>
            </th>
          ))}
          {renderActions && <th className="text-right">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length + (renderActions ? 2 : 1)}
              className="text-center text-danger"
            >
              No data available for the specified criteria.
            </td>
          </tr>
        ) : (
          data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (
              <tr key={row.id} onClick={() => onRowClick && onRowClick(row)}>
                <td className="text-center">
                  {page * rowsPerPage + index + 1}
                </td>
                {columns.map(({ key, render }) => (
                  <td key={key}>{render ? render(row[key], row) : row[key]}</td>
                ))}
                {renderActions && (
                  <td className="td-actions text-right">
                    {renderActions(row)}
                  </td>
                )}
              </tr>
            ))
        )}
      </tbody>
    </table>
  );
};

export default CustomTable;
