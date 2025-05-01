import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { api } from "@/utils/apiProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const ProjectsPopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [projectData, setProjectData] = useState({
    title: "",
    link: "",
    skills: "",
    description: "",
  });
  const [savedProject, setSavedProject] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;

  useEffect(() => {
    if (!user_id) return;
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`${api}/api/profile/get-projects/${user_id}`);
      if (res.data.projects) {
        setSavedProject(res.data.projects); 
      }
    } catch (err) {
      console.error("Error fetching project:", err);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(`${api}/api/profile/save-projects`, {
        user_id,
        projects: projectData,
      });
  
      if (res.data.success) {
        toast.success("Project saved successfully");
        setSavedProject(projectData);
        setShowPopup(false);
      } else {
        toast.error("Failed to save project");
      }
    } catch (err) {
      toast.error("Error saving project");
      console.error(err);
    }
  };
  

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup]);

  const openEditPopup = () => {
    if (savedProject) setProjectData(savedProject);
    setShowPopup(true);
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div className="rounded p-3 mb-12">
        <div className="d-flex justify-between items-start">
          <div className="flex flex-col">
            <h5 className="text-20 fw-600 mb-12">Projects</h5>
            {savedProject ? (
              <>
                <p className="text-16 text-light-1 mb-10 whitespace-pre-line">
                  <strong>{savedProject.title}</strong>
                  <br />
                  {savedProject.link && (
                    <>
                      Link:{" "}
                      <a
                        href={savedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {savedProject.link}
                      </a>
                      <br />
                    </>
                  )}
                  Skills: {savedProject.skills}
                  <br />
                  {savedProject.description}
                </p>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  onClick={openEditPopup}
                  className="text-blue-500 cursor-pointer hover:opacity-80"
                  size="lg"
                />
              </>
            ) : (
              <span
                className="text-blue-1 cursor-pointer"
                onClick={() => setShowPopup(true)}
              >
                Add Projects
              </span>
            )}
          </div>
          <div>
            <img
              src="/img/profile/projects.webp"
              alt="projects"
              style={{ width: 140, height: 110 }}
            />
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-main overlay" onClick={handleOverlayClick}>
          <form onSubmit={(e) => e.preventDefault()} className="popup-second">
            <h3 className="text-lg font-semibold mb-4">Projects</h3>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm">Title of Project *</label>
                <input
                  type="text"
                  name="title"
                  value={projectData.title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Project Link</label>
                <input
                  type="url"
                  name="link"
                  value={projectData.link}
                  onChange={handleChange}
                  placeholder="https://your-project-link.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm">Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={projectData.skills}
                  onChange={handleChange}
                  placeholder="Add skills"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm">Description</label>
                <textarea
                  name="description"
                  value={projectData.description}
                  onChange={handleChange}
                  placeholder="Describe your project"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1.5rem",
              }}
            >
              <button onClick={() => setShowPopup(false)} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleSave} className="save-button">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectsPopupPage;
