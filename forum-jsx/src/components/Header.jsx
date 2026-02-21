import React from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase-config.js";
import { signOut } from "firebase/auth";
import ProfileView from "../view/ProfileView.jsx";
import image from "../assets/image.png";
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
      <nav className="flex bg-sky-100 p-4 justify-between items-center border-b-2 border-gray-200">
        <span>
          <Link to="/">
            <img src={image} alt="Logo" className="h-20 bg-transparent" />
          </Link>
        </span>
        <ul className=" flex flex-row  gap-5 mr-10 text-xl text-black ">
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
