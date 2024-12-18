import React from "react";
import Button from "@mui/material/Button";

const CustomButton = ({ children, ...props }) => {
  return (
    <Button variant="contained" {...props}>
      {children}
    </Button>
  );
};

export default CustomButton;
