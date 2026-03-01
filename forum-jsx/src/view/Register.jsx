import React from "react";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { set, ref } from "firebase/database";
import { db, auth } from "../config/firebase-config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Socials from "../buttons/SignWithSocials";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      username.length < 6 ||
      username.length > 20 ||
      username.match(/[^a-zA-Z0-9_]/)
    ) {
      toast.error(
        "Username must be 6-20 characters and can only contain letters, numbers, and underscores.",
      );
      setLoading(false);
      return;
    }
    if (
      password.length < 6 ||
      password.length > 20 ||
      password !== confirmPassword
    ) {
      toast.error("Your Password must be at least 6 characters ...");
      setLoading(false);
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      try {
        await set(ref(db, "users/" + credentials.user.uid), {
          uid: credentials.user.uid,
          username: username,
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        toast.error("Failed to save user data. " + error.message);
        setLoading(false);
        return;
      }
    } catch (error) {
      toast.error("Registration failed.  " + error.message);
      setLoading(false);
      return;
    }
    toast.success("Registration successful!");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setLoading(false);
    navigate("/home");
    return;
  };

  return (
    <div className="flex max-w-md mx-auto p-4 bg-sky-100/70  flex-col gap-5 rounded mt-20">
      <h1 className="text-center text-3xl ">Register</h1>
      <p className="text-center">It's free and easy</p>
      <form onSubmit={handleSubmit} className="m-5">
        <label className="text-center">Username:</label>
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mb-3 p-2  w-full  bg-white rounded "
        />
        <br />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          placeholder=" Type your email Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-3 p-2  w-full bg-white rounded"
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          placeholder=" Type your password"
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-3 p-2  w-full bg-white rouded"
        />
        <br />
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="mb-3 p-2  w-full bg-white"
        />
        <br />
        <button
          type="submit"
          disabled={loading}
          className="bg-sky-700/70 text-white font-bold py-2 px-4 rounded w-full transition-all duration-400 text-lg cursor-pointer"
        >
          {loading ? "Loading..." : "Register"}
        </button>
        <Socials />
      </form>
    </div>
  );
}

export default Register;
