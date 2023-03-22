import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentForm from "./CommentForm";
import defaultProfilePic from '../images/defaultProfilePic.png';
import "../styles/CommentSection.css";

function CommentSection() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/blogs/${id}/comments`);
        setComments(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchComments();
  }, [id]);

  return (
    <div className="comment-section">
      <h2>Comments ({comments.length})</h2>
      <CommentForm blogId={id} comments={comments} setComments={setComments} />
      <hr />
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <img
              src={comment.author.profilePic ? comment.author.profilePic : defaultProfilePic}
              alt={`${comment.author.username}'s profile pic`}
              className="profile-pic"
            />
            <div className="comment-details">
              <h5 style={{paddingTop: "15px", color: "#2a2b2e"}}>{comment.author.username}</h5>
              <hr />
              <p>{comment.text}</p>
              <span>{comment.nLikes} likes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;