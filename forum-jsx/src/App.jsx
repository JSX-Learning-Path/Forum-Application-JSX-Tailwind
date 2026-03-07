import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./view/Register.jsx";
import Home from "./view/Home.jsx";
import Header from "./components/Header.jsx";
import Create from "./view/Create.jsx";
import Login from "./view/Login.jsx";
import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import ProfileView from "./view/ProfileView.jsx";
import { ref, onValue } from "firebase/database";
import { db } from "./config/firebase-config.js";
import Authentication from "./Hoc/Authentication.jsx";

const App = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsRef = ref(db, "posts");
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      const postsArray = data
        ? Object.entries(data).map(([id, post]) => ({ id, ...post }))
        : [];
      setPosts(postsArray);
    });
  }, []);

  return (
    <BrowserRouter>
      <Header posts={posts} />
      <Routes>
        <Route path="/" element={<Home posts={posts} setPosts={setPosts} />} />
        <Route path="/home" element={<Home posts={posts} setPosts={setPosts} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<Authentication><Create /></Authentication>} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Authentication><ProfileView /></Authentication>} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
