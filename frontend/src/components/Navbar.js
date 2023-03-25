import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ user, setUser, searchValue, setSearchValue }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  localStorage.removeItem("searchOpen");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchValue(searchValue);
  }

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        The Tunnicliff Blog
      </Link>
      <div className="search-container" style={{display: `${location.pathname === '/' ? '' : 'none'}`}}>
        <button
          className={`search-icon-btn ${searchOpen ? "hidden" : ""}`}
          onClick={toggleSearch}
        >
          🔍
        </button>
        <form
          onSubmit={handleSearchSubmit}
          className={`search-form ${searchOpen ? "open" : ""}`}
        >
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
          />
        </form>
        <button
          className={`collapse-icon-btn ${searchOpen ? "" : "hidden"}`}
          onClick={toggleSearch}
        >
          &lt;
        </button>
      </div>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          {user ? (
            <>
              {user.username === process.env.REACT_APP_ADMIN && 
              <li className="nav-item">
                <Link className="nav-link" to="/create-blog-post">
                  Create Blog Post
                </Link>
              </li>}
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Log In
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
