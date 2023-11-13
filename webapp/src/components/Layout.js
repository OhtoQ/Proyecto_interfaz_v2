import React from "react";
import Navbar from "./Navbar";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Container } from "@mui/material";

const Layout = ({ loading, children }) => (
  <>
    <Navbar />
    <Container maxWidth="lg" sx={{ paddingTop: 2 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 12 }}>
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
    </Container>
  </>
);

export default Layout;
