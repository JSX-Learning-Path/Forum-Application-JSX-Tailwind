import { useState } from "react";
import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase-config.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  //add handle submit
  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form className="max-w-md mx-auto p-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 w-full"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white p-2">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
