import React, { useContext, useState } from "react";
import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { toast } from "react-toastify";
import { FaSignOutAlt } from "react-icons/fa"; // Assuming you have react-icons installed

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);

  const onSignOut = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      toast.success("로그아웃 되었습니다.");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.code);
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      // You can use FileReader to preview the image if needed
      // const reader = new FileReader();
      // reader.onloadend = () => {
      //   setProfileImage(reader.result);
      // };
      // reader.readAsDataURL(file);

      setProfileImage(file);
    }
  };

  return (
    <div className="profile__box">
      <div className="flex__box-lg">
        <div className="profile__image"></div>
        <div className="profile__info">
          <div className="profile__email">{user?.email}</div>
          <div className="profile__name">{user?.displayName || "사용자"}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
