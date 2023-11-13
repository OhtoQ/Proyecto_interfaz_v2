import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Footer = () => (
  <Box
    sx={{
      flexGrow: 1,
      position: "absolute",
      height: "100",
      width: "100%",
      display: "flex",
    }}
  >
    <AppBar sx={{ bgcolor: "main" }} position="relative">
      <Typography variant="h8" component="div" sx={{ flexGrow: 1 }}>
        Facultad de Ingeniería UNAM
      </Typography>
    </AppBar>
  </Box>
);

export default Footer;
