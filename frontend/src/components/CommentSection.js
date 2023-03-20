import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentForm from "./CommentForm";

import "../styles/CommentSection.css";

function CommentSection() {
  const { blogId } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await axios.get(`/blogs/${blogId}/comments`);
        setComments(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchComments();
  }, [blogId]);

  return (
    <div className="comment-section">
      <h2>Comments ({comments.length})</h2>
      <CommentForm blogId={blogId} setComments={setComments} />
      <hr />
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <img
              src={comment.author.profilePic}
              alt={`${comment.author.name}'s profile pic`}
              className="profile-pic"
            />
            <div className="comment-details">
              <h5>{comment.author.name}</h5>
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