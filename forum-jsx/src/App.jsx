import { BrowserRouter,  Route, Routes } from "react-router-dom";
import Register from "./view/Register.jsx";
import Home from "./view/Home.jsx";
import React from "react";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
