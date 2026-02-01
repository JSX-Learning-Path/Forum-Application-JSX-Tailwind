import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function Header() {
  //   const { user } = useAppContext();
  //   const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAppContext();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
            {isLoggedIn && <span> (Logged In)</span>}
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/create">Create</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
