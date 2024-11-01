// App.js
import React from "react";
import { Routes, Route, Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Typography } from "@mui/material";
import Home from "../src/components/Home";
function App() {
  return (
    <>
      {/* Navigation mit Material UI */}
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
        </Toolbar>
      </AppBar>

      {/* Seiteninhalt */}
      <Container style={{ marginTop: "2rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
