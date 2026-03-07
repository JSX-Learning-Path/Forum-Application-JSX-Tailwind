import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase-config.js";
import { signOut } from "firebase/auth";
import image from "../assets/image.png";
import { getUserByHandle } from "../service/users.js";

function Header({ posts = [] }) {
  const [user] = useAuthState(auth);
  // const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user?.uid) {
      getUserByHandle(user.uid).then((snapshot) => {
        const data = snapshot.exists() ? snapshot.val() : null;
        setUserData(data);
      });
    }
  }, [user]);

  const handleLogOut = async () => {
    signOut(auth).catch(() => {
      console.log("Error logging out");
    });
  };
  const filteredPosts = posts.filter((post) => {
    return (
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  console.log("User in Header:", user);
  return (
    <header className="bg-indigo-50/50 shadow-md">
      <nav className="flex p-4 justify-center items-center text-gray-800 gap-10 ">
        <span>
          <Link to="/">
            <img src={image} alt="Logo" className="h-20 " />
          </Link>
        </span>
        {/* Search input */}
        <div className="flex-1 flex justify-center relative">
          <input
            type="text"
            className="border p-2 w-full max-w-xs rounded"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded w-full max-w-xs z-10">
              {filteredPosts.length === 0 ? (
                <span className="block p-2 text-gray-500">Not found</span>
              ) : (
                filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="block p-2 border-b last:border-b-0 hover:bg-sky-100"
                  >
                    <h4 className="font-bold">{post.title}</h4>
                    <p className="text-sm truncate">{post.content}</p>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
        <ul className="flex flex-row gap-5 mr-10 text-xl text-shadow-red-500 ">
          <li>
            <Link to="/" className="">
              Home
            </Link>
          </li>
          {!user && (
            <>
              <li>
                <Link to="/register" className="">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="">
                  Login
                </Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <Link to="/create" className="">
                  Create
                </Link>
              </li>
              <li>
                <Link to="/profile" className="">
                  <img
                    src={userData && userData.profilePicture ? userData.profilePicture : image}
                    alt="Profile"
                    className="rounded-full w-10 h-10 object-cover border"
                  />
                </Link>
              </li>
              <li>
                <button onClick={handleLogOut}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
      {/* Field for search */}
      <div className="flex justify-center mt-4 relative"></div>
      {/* Results from search */}
    </header>
  );
}

export default Header;
