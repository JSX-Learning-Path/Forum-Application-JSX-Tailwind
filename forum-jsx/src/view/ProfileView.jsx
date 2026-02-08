import { auth, db } from "../config/firebase-config.js";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { useState, useEffect } from "react";
import { getUserByHandle } from "../service/users.js";
import { ref, update } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

function ProfileView() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [bio, setBio] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [pictureFile, setPictureFile] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      getUserByHandle(user.uid).then((snapshot) => {
        const data = snapshot.exists() ? snapshot.val() : null;
        setUserData(data);
        setBio(data?.bio || "");
        setProfilePicture(data?.profilePicture || "");
      });
    }
  }, [user]);

  const handleEdit = () => {
    setBio(userData?.bio || "");
    setProfilePicture(userData?.profilePicture || "");
    setShowEdit(true);
  };

  const handlePictureChange = (e) => {
    setPictureFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    let profilePicUrl = profilePicture;
    if (pictureFile) {
      const storage = getStorage();
      const picRef = storageRef(storage, `profilePictures/${user.uid}`);
      await uploadBytes(picRef, pictureFile);
      profilePicUrl = await getDownloadURL(picRef);
    }
    await update(ref(db, `/users/${user.uid}`), {
      bio: bio,
      profilePicture: profilePicUrl,
    });
    setProfilePicture(profilePicUrl);
    setShowEdit(false);
    setPictureFile(null);
  };

  return (
    <div className="p-4">
      {userData && <button onClick={handleEdit}>Edit Bio</button>}
      <h1>Profile</h1>
      <p>Email: {user?.email}</p>
      <p>Username: {userData?.username}</p>
      {profilePicture && (
        <img
          src={profilePicture}
          alt="Profile"
          className="rounded-full w-15 h-15"
        />
      )}
      {showEdit && (
        <div>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          <input type="file" accept="image/*" onChange={handlePictureChange} />
          <button onClick={handleSubmit}>Save</button>
        </div>
      )}
      <p>Bio: {bio}</p>
    </div>
  );
}
export default ProfileView;
//profile picture , bio,username , email, list of posts, friends request , settings(edit profile , change password , delete account)
