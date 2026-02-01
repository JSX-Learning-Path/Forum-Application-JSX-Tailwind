import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./view/Register.jsx";
import Home from "./view/Home.jsx";
import React from "react";
import Create from "./view/Create.jsx";
import Login from "./view/Login.jsx";
import Header from "./components/Header.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<Create />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
