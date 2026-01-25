import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./view/Register.jsx";
import Home from "./view/Home.jsx";
import React from "react";
import Create from "./view/Create.jsx";
import Login from "./view/Login.jsx";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<Create />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
