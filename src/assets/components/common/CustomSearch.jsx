import React from "react";
import { TextField } from "@mui/material";

const CustomSearch = ({
  value,
  onChange,
  placeholder = "Search...",
  setPage,
}) => {
  const handleSearch = (e) => {
    if (setPage) setPage(0);
    onChange(e.target.value);
  };

  return (
    <TextField
      label={placeholder}
      variant="outlined"
      size="small"
      value={value}
      onChange={handleSearch}
    />
  );
};

export default CustomSearch;
