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
      <nav className="bg-orange-100/60 p-4 ">
        <ul className=" flex flex-row justify-around ">
          <li>
            <Link to="/" className="">
              Home
            </Link>
          </li>

          <li>
            <Link to="/register" className="">
              Register
            </Link>
          </li>
          <li>
            <Link to="/create" className="">
              Create
            </Link>
          </li>
          {user ? (
            <button onClick={handleLogOut}>Logout</button>
          ) : (
            <Link to="/login" className="">
              Login
            </Link>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
