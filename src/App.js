// App.js
import React from "react";
import { Routes, Route, Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Typography } from "@mui/material";
import Home from "../src/components/Home";
import ChatGPT from "../src/components/ChatGPT";

function App() {
  return (
    <>
      {/* Navigation mit Material UI */}
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/">
            ChatGPT
          </Button>
        </Toolbar>
      </AppBar>

      {/* Seiteninhalt */}
      <Container style={{ marginTop: "2rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatGPT" element={<ChatGPT />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
