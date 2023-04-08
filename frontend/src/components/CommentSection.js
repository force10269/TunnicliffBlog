import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentForm from "./CommentForm";
import defaultProfilePic from "../images/defaultProfilePic.png";
import { FaTrashAlt, FaRegEdit } from "react-icons/fa";
import "../styles/CommentSection.css";

function CommentSection() {
  const { slug } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const iconSize = 25;

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/blogs/${slug}/comments`
        );
        setComments(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [slug]);

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_API_URL}/comments/${commentId}`
      );
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (commentId, newText) => {
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_BASE_API_URL}/comments/${commentId}`,
        {
          text: newText,
        }
      );
  
      const updatedComment = res.data;
  
      // Add the profile picture URL to the updated comment's author
      if (updatedComment.author.profilePic) {
        updatedComment.author.profilePic = `${process.env.REACT_APP_BASE_API_URL}/images/${updatedComment.author.profilePic}`;
      }
  
      setComments(
        comments.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading comments...</p>;
  }

  return (
    <div className="comment-section">
      <h2>Comments ({comments.length})</h2>
      <CommentForm slug={slug} comments={comments} setComments={setComments} />
      <hr />
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <img
              src={
                comment.author.profilePic
                  ? comment.author.profilePic
                  : defaultProfilePic
              }
              alt={`${comment.author.username}'s profile pic`}
              className="profile-pic"
            />
            <div className="comment-details">
              <h5 style={{ paddingTop: "15px", color: "#2a2b2e" }}>
                {comment.author.username}
              </h5>
              <hr />
              <p>{comment.text}</p>
            </div>
            {user && comment.author.userId === user._id && (
              <div
                className="comment-icons"
                style={{ marginLeft: "auto", marginRight: "0" }}
              >
                <button
                  onClick={() =>
                    handleEdit(
                      comment._id,
                      prompt("Edit your comment", comment.text)
                    )
                  }
                >
                  <FaRegEdit size={iconSize} />
                </button>
                <button
                  style={{ marginLeft: "1vh" }}
                  onClick={() => handleDelete(comment._id)}
                >
                  <FaTrashAlt size={iconSize} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
   
