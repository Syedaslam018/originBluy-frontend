import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../../styles/Dashboard.css";

const Dashboard = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const user = useSelector((state) => state.auth.user);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Fetch uploaded media
  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/media`, {
        headers: { Authorization:  user?.token},
      });
      setMediaFiles(response.data);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  // Upload media
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/media/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: user?.token,
        },
      });
      if (response.status === 201) {
        setFile(null); // Reset state
        document.getElementById("fileInput").value = ""; // Clear input field
      }
      fetchMedia(); // Refresh media list
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Delete media
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/media/${id}`, {
        headers: { Authorization: user?.token},
      });
      fetchMedia(); // Refresh media list
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };


  const filteredMedia = mediaFiles.filter((item) => {
    if (filterType === "all") return true;
    if (filterType === "image") return item.type.startsWith("image");
    if (filterType === "video") return item.type.startsWith("video");
    return false;
  });

  return (
    <div className="dashboard-container">
      <h2>Media Dashboard</h2>

      <form onSubmit={handleUpload} className="upload-form">
        <input type="file" id="fileInput" onChange={(e) => setFile(e.target.files[0])} required />
        <button onClick={handleUpload}>Upload</button>
      </form>

      <h3>Filter Media</h3>
      <select onChange={handleFilterChange} value={filterType}>
        <option value="all">All</option>
        <option value="image">Images</option>
        <option value="video">Videos</option>
      </select>

      <div className="media-gallery">
        {filteredMedia.map((media) => (
          <div key={media._id} className="media-item">
            {media.type.startsWith("image") ? (
              <img src={media.url} alt="Uploaded" className="media-preview" />
            ) : (
              <video src={media.url} controls className="media-preview"></video>
            )}
            <button className="delete-button" onClick={() => handleDelete(media._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
