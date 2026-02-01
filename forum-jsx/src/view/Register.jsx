import React from "react";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { set, ref } from "firebase/database";
import { db, auth } from "../config/firebase-config"; // Make sure 'auth' is imported

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      username.length < 6 ||
      username.length > 20 ||
      username.match(/[^a-zA-Z0-9_]/)
    ) {
      setError(
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
      setError(`Your Password must be at least 6 characters ...`);
      setLoading(false);
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("User registered:", credentials.user);
      try {
        await set(ref(db, "users/" + credentials.user.uid), {
          uid: credentials.user.uid,
          username: username,
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        setError("Failed to save user data. " + error.message);
        setLoading(false);
        return;
      }
    } catch (error) {
      setError("Registration failed. " + error.code + ": " + error.message);
      setLoading(false);
      return;
    }
    setSuccess(true);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setLoading(false);
    return;
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-200 rounded flex flex-col gap-5">
      <h1 className="text-center text-3xl ">Register</h1>
      <form onSubmit={handleSubmit}>
        <label className="text-center">Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mb-3 p-2  w-full bg-amber-50 rounded hover:bg-amber-100"
        />
        <br />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-3 p-2  w-full bg-amber-50 rounded hover:bg-amber-100"
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-3 p-2  w-full bg-amber-50 rounded hover:bg-amber-100"
        />
        <br />
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="mb-3 p-2  w-full bg-amber-50 rounded hover:bg-amber-100"
        />
        <br />
        <button
          type="submit"
          disabled={loading}
          className="bg-stone-400 text-white font-bold py-2 px-4 rounded w-full transition-all duration-400 text-lg cursor-pointer"
        >
          {loading ? "Loading..." : "Register"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default Register;
