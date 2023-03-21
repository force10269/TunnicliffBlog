import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import BlogPost from "./components/BlogPost";
import CreateBlogPost from "./components/CreateBlogPost";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="container-fluid">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/blogs/:id" element={<BlogPost />} />
          {user && (
            <Route path="/create-blog-post" element={<CreateBlogPost />} />
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
