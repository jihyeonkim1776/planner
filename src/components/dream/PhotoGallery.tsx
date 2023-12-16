import React, { useState, ChangeEvent, useEffect } from "react";
import { IoMdPhotos } from "react-icons/io";
import { app, storage } from "firebaseApp";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "firebase/auth";

interface PhotoGalleryProps {}

const PhotoGallery: React.FC<PhotoGalleryProps> = () => {
  const [images, setImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // Track the active image index
  const auth = getAuth(app);
  const user = auth.currentUser;
  const storageRef = user ? ref(storage, `images/${user.uid}`) : undefined!;

  const handleImageChange = (index: number): void => {
    console.log(`Change image at index ${index}`);
    setActiveIndex(null); // Close the active image on change
  };

  const handleImageRemove = (index: number): void => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setActiveIndex(null); // Close the active image on remove
  };

  const handleImageClick = (index: number): void => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index)); // Toggle the active image on click
  };

  const fetchImages = async (): Promise<void> => {
    try {
      if (user) {
        const imageList = await listAll(storageRef);
        const imageUrls = await Promise.all(
          imageList.items.map(async (imageRef) => getDownloadURL(imageRef))
        );
        setImages(imageUrls);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchImages();
    }
  }, [user]);

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        const uniqueFilename = `${uuidv4()}-${file.name}`;

        const imageRef = ref(storageRef, uniqueFilename);
        const uploadTask = uploadBytesResumable(imageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Error uploading image:", error);
          },
          () => {
            console.log("Upload successful");
            fetchImages();
          }
        );
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div>
      <div className="photo">
        <input
          type="file"
          id="file-upload"
          onChange={handleImageUpload}
          accept="image/*"
        />
        <label htmlFor="file-upload" className="custom-file-upload">
          Custom Upload
          <IoMdPhotos />
        </label>
        <div className="photo-container">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className={`photo-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => handleImageClick(index)}
            >
              <img src={imageUrl} alt={`Photo ${index + 1}`} />
              <div className="overlay">
                <button onClick={() => handleImageChange(index)}>Change</button>
                <button onClick={() => handleImageRemove(index)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoGallery;
