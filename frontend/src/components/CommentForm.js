import React, { useState } from "react";
import PropTypes from "prop-types";

function CommentForm(props) {
  const [commentText, setCommentText] = useState("");

  function handleCommentTextChange(event) {
    setCommentText(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Call a function passed in through props to submit the comment
    props.onSubmitComment(commentText);

    // Clear the comment text field
    setCommentText("");
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="comment-text">Add a comment:</label>
        <textarea
          className="form-control"
          id="comment-text"
          value={commentText}
          onChange={handleCommentTextChange}
          required
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}

CommentForm.propTypes = {
  onSubmitComment: PropTypes.func.isRequired,
};

export default CommentForm;
