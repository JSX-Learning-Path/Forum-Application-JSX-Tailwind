import React from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase-config.js";
import { signOut } from "firebase/auth";
// import { useAppContext } from "../context/AppContext";

function Header() {
  const [user] = useAuthState(auth);

  const handleLogOut = async () => {
    signOut(auth).catch(() => {
      console.log("Error logging out");
    });
  };
  console.log("User in Header:", user);
  return (
    <header>
      <nav className="flex flex-col items-center justify-between p-4 bg-gray-400 text-white">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/create">Create</Link>
          </li>
          {user ? (
            <button onClick={handleLogOut}>LogOut</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
