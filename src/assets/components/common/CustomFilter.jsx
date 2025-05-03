import React from "react";
import { TextField, MenuItem } from "@mui/material";

const CustomFilter = ({
  value,
  onChange,
  options,
  label,
  minWidth = "120px",
  setPage,
}) => {
  const handleFilter = (e) => {
    if (setPage) setPage(0);
    onChange(e.target.value);
  };

  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={handleFilter}
      variant="outlined"
      size="small"
      style={{ minWidth }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CustomFilter;
