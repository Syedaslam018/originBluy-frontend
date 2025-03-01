import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../../styles/Dashboard.css";

const Dashboard = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Pagination: 6 items per page
  
  const user = useSelector((state) => state.auth.user);

  
  // Fetch uploaded media
  useEffect(() => {
    fetchMedia();
  }, );
  
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
  
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  // Upload media
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp", "video/mp4", "video/avi", "video/mkv", "video/webm"];

    const formData = new FormData();
    formData.append("file", file);
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type! Please upload an image or video.");
      document.getElementById("fileInput").value = ""; 
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/media/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: user?.token,
        },
      });
      if (response.status === 201) {
        setMessage("File uploaded successfully!");
        setFile(null); // Reset state
        document.getElementById("fileInput").value = ""; // Clear input field
      }
      fetchMedia(); // Refresh media list
    } catch (error) {
      setMessage("File upload failed. Try again.");
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
    setCurrentPage(1);
  };


  const filteredMedia = mediaFiles.filter((item) => {
    if (filterType === "all") return true;
    if (filterType === "image") return item.type.startsWith("image");
    if (filterType === "video") return item.type.startsWith("video");
    return false;
  });


  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
  const paginatedMedia = filteredMedia.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="dashboard-container">
      <h2>Media Upload & Gallery</h2>
      <div className="upload-section">
        <input type="file" id="fileInput" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <p>{message}</p>
      </div>

      <div className="filter-section">
        <label>Filter by Type:</label>
        <select onChange={handleFilterChange} value={filterType}>
          <option value="all">All</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
      </div>

      <div className="media-gallery">
        {paginatedMedia.map((item) => (
          <div key={item._id} className="media-item">
            {item.type.startsWith("image") ? (
              <img src={item.url} alt={item.filename} />
            ) : (
              <video controls>
                <source src={item.url} type={item.fileType} />
              </video>
            )}
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
