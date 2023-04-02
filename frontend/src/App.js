import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import BlogPost from "./components/BlogPost";
import CreateBlogPost from "./components/CreateBlogPost";
import BlogPreview from "./components/BlogPreview";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [searchValue, setSearchValue] = useState(""); 

  return (
    <Router>
      <div className="container-fluid">
        <Navbar user={user} setUser={setUser} searchValue={searchValue} setSearchValue={setSearchValue} />
        <Routes>
          <Route exact path="/" element={<Home searchValue={searchValue}/>} />
          <Route path="/blogs/:id" element={<BlogPost />} />
          {user && user.username === process.env.REACT_APP_ADMIN && (
            <>
              <Route path="/create-blog-post" element={<CreateBlogPost />} />
              <Route path="/preview" element={<BlogPreview />} />
            </>
          )}
          {!user && (
            <>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/signup" element={<Signup setUser={setUser}/>} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
