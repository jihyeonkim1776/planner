import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
interface ProjectItem {
  title: string;
  content: string;
}

const Project: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [newProject, setNewProject] = useState<ProjectItem>({
    title: "",
    content: "",
  });

  const handleModalOpen = () => {
    setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  const handleAddProject = () => {
    setProjects([...projects, newProject]);
    setNewProject({
      title: "",
      content: "",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="project-container">
      <div className="project">
        {/* 프로젝트 아이템들... */}
        {projects.map((project, index) => (
          <div key={index} className="content">
            <div className="content__name">{project.title}</div>
            <div className="content__duration">
              {new Date().toLocaleDateString()}
            </div>
            <div className="content__detail">{project.content}</div>
            <div className="content__delete">x</div>
          </div>
        ))}
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header"></div>
            <label htmlFor="title">제목:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newProject.title}
              onChange={handleInputChange}
            />
            <label htmlFor="content">내용:</label>
            <textarea
              id="content"
              name="content"
              value={newProject.content}
              onChange={handleInputChange}
            ></textarea>
            <button onClick={handleAddProject}>+</button>
          </div>
        </div>
      )}

      {/* 프로젝트 추가하기 버튼 */}
      <button onClick={handleModalOpen}>
        {" "}
        <CiCirclePlus />
      </button>
    </div>
  );
};

export default Project;
