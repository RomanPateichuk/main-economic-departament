import {Box, CircularProgress} from "@mui/material";
import React from "react";

const loaderStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
}

export const Loader: React.FC = ()=> (
  <Box sx={loaderStyles}>
    <CircularProgress/>
  </Box>
)