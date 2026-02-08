import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./view/Register.jsx";
import Home from "./view/Home.jsx";
import Header from "./components/Header.jsx";
import Create from "./view/Create.jsx";
import Login from "./view/Login.jsx";
import React from "react";
import  { Toaster } from "react-hot-toast";
import ProfileView from "./view/ProfileView.jsx";


const App = () => {
  // const notify = () => {
  //   toast.success("Welcome to the Forum App!");
  // };
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<Create />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfileView />} />
      </Routes>
      {/* <div> */}
        {/* <button onClick={notify}>Make me a toast</button> */}
        <Toaster />
      {/* </div> */}
    </BrowserRouter>
  );
};

export default App;
