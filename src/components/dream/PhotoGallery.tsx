import React, { useState, ChangeEvent } from "react";
import { IoMdPhotos } from "react-icons/io";
interface PhotoGalleryProps {}

const PhotoGallery: React.FC<PhotoGalleryProps> = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleImageChange = (index: number): void => {
    // Implement logic to change the image (e.g., open a file input for selection)
    console.log(`Change image at index ${index}`);
  };

  const handleImageRemove = (index: number): void => {
    // Implement logic to remove the image
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (file) {
      // You can perform additional validations or processing here if needed
      setImages((prevImages) => [...prevImages, URL.createObjectURL(file)]);
    }
  };

  return (
    <div>
      <div className="photo">
        {" "}
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
            <div key={index} className="photo-item">
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
