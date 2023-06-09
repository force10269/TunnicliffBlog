import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Signup.css";

const Signup = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseError = () => {
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Upload profile pic and get the ObjectId
      let profilePicObjectId = null;
      if (profilePic) {
        const formData = new FormData();
        formData.append("image", profilePic);
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_API_URL}/images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        profilePicObjectId = res.data.id;
      }

      await axios.post(`${process.env.REACT_APP_BASE_API_URL}/signup`, {
        username,
        email,
        password,
        confirmPassword,
        profilePic: profilePicObjectId,
      });

      const loginRes = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/login`,
        {
          email,
          password,
        }
      );

      delete loginRes.data.user.email;
      delete loginRes.data.user.password;
      delete loginRes.data.user.__v;

      localStorage.setItem("token", loginRes.data.token);
      setUser(loginRes.data.user);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));
      navigate("/");
    } catch (error) {
      if (error.response?.data?.errors?.[0]?.hasOwnProperty("msg")) {
        setErrorMessage(error.response.data.errors[0].msg);
      } else {
        setErrorMessage(error.response.data.message);
      }
    }
  };

  const navigate = useNavigate();

  const closeModal = () => {
    navigate("/");
  };

  return (
    <div className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <button type="button" className="close" onClick={closeModal} data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
          </button>
          <div className="modal-header">
            <h4 className="modal-title">Sign up</h4>
          </div>
          <div className="modal-body">
            {errorMessage && (
              <div className="alert-container">
                <div className="alert alert-danger">
                  {errorMessage}
                  &nbsp;
                  <button type="button" className="alert-close" onClick={handleCloseError} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="profilePic">Profile Picture: &nbsp;</label>
                <input
                  type="file"
                  className="form-control-file"
                  id="profilePic"
                  accept="image/*"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username: &nbsp; </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email address: &nbsp; </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password: &nbsp; </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirm Password: &nbsp;
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
            <br />
            <div className="mt-3">
              Already have an account? <Link to="/login">Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
