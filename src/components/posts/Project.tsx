import React, { useContext, useState, useEffect, useRef } from "react";
import { CiCirclePlus } from "react-icons/ci";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import AuthContext from "context/AuthContext";

interface ProjectItem {
  title: string;
  content: string;
  date: string;
}

interface ProjectProps {}

const Project: React.FC<ProjectProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [newProject, setNewProject] = useState<ProjectItem>({
    title: "",
    content: "",
    date: new Date().toLocaleDateString(), // Default to today's date
  });
  const { user } = useContext(AuthContext);

  const handleModalOpen = () => {
    setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
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

  const handleAddProject = async () => {
    try {
      const updatedProjects = [...projects, newProject];

      const querySnapshot = await getDocs(collection(db, "projects"));

      if (querySnapshot.size > 0) {
        const docRef = querySnapshot.docs[0].ref;

        await updateDoc(docRef, {
          projects: updatedProjects,
          updatedAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          email: user?.email,
          uid: user?.uid,
        });
      } else {
        const docRef = await addDoc(collection(db, "projects"), {
          projects: updatedProjects,
          createdAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          email: user?.email,
          uid: user?.uid,
        });

        console.log("Project added to Firestore with ID:", docRef.id);
      }

      setProjects(updatedProjects);
      setNewProject({
        title: "",
        content: "",
        date: new Date().toLocaleDateString(),
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding/updating project:", error);
    }
  };

  // Fetch projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(
          collection(db, "projects"),
          where("uid", "==", user?.uid)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          const projectsData = querySnapshot.docs[0].data();
          setProjects(projectsData.projects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []); // Run this effect only once on component mount
  const handleDeleteProject = async (index: number) => {
    try {
      const updatedProjects = [...projects];
      updatedProjects.splice(index, 1);

      const querySnapshot = await getDocs(collection(db, "projects"));

      if (querySnapshot.size > 0) {
        const docRef = querySnapshot.docs[0].ref;

        await updateDoc(docRef, {
          projects: updatedProjects,
          updatedAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          email: user?.email,
          uid: user?.uid,
        });
      }

      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        // Clicked outside the modal, close it
        setIsModalOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Detach the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="project-container">
      <div className="title">Project</div>
      <div className="project">
        {projects.map((project, index) => (
          <div key={index} className="content">
            <div className="content__name">{project.title}</div>
            <div className="content__duration">{project.date}</div>
            <div className="content__detail">{project.content}</div>
            <div
              className="content__delete"
              onClick={() => handleDeleteProject(index)}
            >
              x
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <div className="modal-header"></div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newProject.title}
              onChange={handleInputChange}
            />
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={newProject.content}
              onChange={handleInputChange}
            ></textarea>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={newProject.date}
              onChange={handleInputChange}
              className="date"
            />
            <button onClick={handleAddProject}>Add Project</button>
          </div>
        </div>
      )}
      <div className="plus" onClick={handleModalOpen}>
        {isModalOpen === false ? "+" : ""}
      </div>
    </div>
  );
};

export default Project;
