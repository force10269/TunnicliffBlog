import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Editor from "./Editor";
import CreateBlogPostLoadingOverlay from "./CreateBlogPostLoadingOverlay";
import "react-quill/dist/quill.snow.css";
import "../styles/CreateBlogPost.css";

const CreateBlogPost = () => {
  const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
  const filters = process.env.REACT_APP_FILTERS.split(",");
  const [creatingBlogPost, setCreatingBlogPost] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(new Set());
  const [preview, setPreview] = useState(false);
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    author: JSON.parse(localStorage.getItem("user")),
    postTime: Date.now(),
    topics: [],
    image: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setBlog((prevBlog) => {
      return {
        ...prevBlog,
        topics: Array.from(selectedFilters),
      };
    });
  }, [selectedFilters]);

  const handlePreviewClick = (event) => {
    event.preventDefault();
    localStorage.setItem("previewBlog", JSON.stringify(blog));
    window.open("/preview");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBlog((prevBlog) => {
      return {
        ...prevBlog,
        [name]: value,
      };
    });
  };

  // This function is for replacing the pure data inside of the blog.content with the API url to the image
  const replaceEmbeddedImages = async (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = doc.getElementsByTagName("img");

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const src = img.getAttribute("src");

      if (src.startsWith("data:")) {
        // Extract the base64 data
        const base64Data = src.split(",")[1];

        // Convert base64 to a file
        const file = base64ToFile(base64Data);

        // Upload the image and get the ObjectId
        const objectId = await uploadImage(file);

        // Replace the src attribute with the new URL
        img.setAttribute(
          "src",
          `${process.env.REACT_APP_BASE_API_URL}/images/${objectId}`
        );

        // Add loading="lazy" to increase img loading efficiency
        img.setAttribute("loading", "lazy");
      }
    }

    return doc.documentElement.outerHTML;
  };

  // This is helper to replaceEmbeddedImages
  const base64ToFile = (base64Data) => {
    // Replace spaces with '+' (since '+' is replaced with ' ' during encoding)
    const data = base64Data.replace(/ /g, "+");

    // Convert base64 data to ArrayBuffer
    const byteString = atob(data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    // Create a Blob with the ArrayBuffer data and return a File object
    const blob = new Blob([arrayBuffer], { type: "image/png" });
    const file = new File([blob], "embedded-image.png");

    return file;
  };

  // This is a helper to replaceEmbeddedImages
  const uploadImage = async (file) => {
    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      const response = await axios.post(
        `${BASE_API_URL}/images`,
        imageFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.id;
    } catch (err) {
      console.error(err);
      return "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (preview) {
      setPreview(false);
      return;
    }

    setCreatingBlogPost(true);

    const user = JSON.parse(localStorage.getItem("user"));

    // Rename _id field to userId
    user.userId = user._id;
    delete user._id;

    if (user.username !== process.env.REACT_APP_ADMIN) {
      setError("You are not authorized to create a blog post.");
      return;
    }

    // Check if image is selected
    let coverImage;
    const imageFormData = new FormData();
    if (blog.image) {
      imageFormData.append("image", blog.image.file);

      try {
        // Upload the image first and get the ObjectId
        const imageResponse = await axios.post(
          `${BASE_API_URL}/images`,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        coverImage = imageResponse.data.id;
      } catch (err) {
        setError(err.message);
        return;
      }
    }

    // Replace embedded images and update blog content
    const newContent = await replaceEmbeddedImages(blog.content);

    // Append the coverImage attribute to the blog
    const blogWithAuthor = {
      ...blog,
      content: newContent,
      author: user,
      topics: Array.from(selectedFilters),
      coverImage: coverImage,
    };

    try {
      const response = await axios.post(
        `${BASE_API_URL}/blogs`,
        blogWithAuthor
      );
      if (response.status === 201) {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
      setCreatingBlogPost(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setBlog((prevBlog) => {
          return {
            ...prevBlog,
            image: {
              name: file.name,
              dataUrl: reader.result,
              file: file,
            },
          };
        });
      };
    }
  };

  const handleQuillImageUpload = async (file) => {
    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      const response = await axios.post(
        `${BASE_API_URL}/images`,
        imageFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.url;
    } catch (err) {
      console.error(err);
      return "";
    }
  };

  const handleFilterClick = (topic) => {
    const newSelectedFilters = new Set(selectedFilters);
    if (selectedFilters.has(topic)) {
      newSelectedFilters.delete(topic);
    } else {
      newSelectedFilters.add(topic);
    }
    setSelectedFilters(newSelectedFilters);
  };

  const handleClearClick = (event) => {
    event.preventDefault();
    setSelectedFilters(new Set());
  };

  if(creatingBlogPost) {
    return <CreateBlogPostLoadingOverlay />
  }

  return (
    <div className="create-blog-post-container">
      {error && <p className="error">{error}</p>}
      <h2 style={{ textAlign: "center" }}>Create Blog Post</h2>
      <form onSubmit={handleSubmit}>
        {blog.image ? (
          <div className="selected-image-container">
            <img src={blog.image.dataUrl} alt="Selected" />
            <button
              onClick={() =>
                setBlog((prevBlog) => ({ ...prevBlog, image: null }))
              }
            >
              X
            </button>
          </div>
        ) : (
          <div className="file-input-container">
            <label htmlFor="image">Image</label>
            <br />
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        )}

        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={blog.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />

        <Editor
          content={blog.content}
          onChange={(value) =>
            setBlog((prevBlog) => ({ ...prevBlog, content: value }))
          }
          onImageUpload={handleQuillImageUpload}
        />
        <br />
        <br />
        <br />
        <br />
        <br />

        <label htmlFor="topic">Topic(s)</label>
        <ul className="topic-list">
          {filters.map((filter) => (
            <li
              key={filter}
              className={`topic-button ${
                selectedFilters.has(filter) ? "active" : ""
              }`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </li>
          ))}
        </ul>

        <div className="clear-container">
          <button className="clear-button" onClick={handleClearClick}>
            Clear topics
          </button>
        </div>
        <br />

        <button className="endFormButton" onClick={handlePreviewClick}>
          Preview
        </button>
        <button className="endFormButton" type="submit">
          Create Blog Post
        </button>
      </form>
    </div>
  );
};

export default CreateBlogPost;
