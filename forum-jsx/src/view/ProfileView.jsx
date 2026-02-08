import { auth,db } from "../config/firebase-config.js";
import { useAuthState } from "react-firebase-hooks/auth";
import React from "react";
import { useState, useEffect } from "react";
import { getUserByHandle } from "../service/users.js";
import {ref , update} from "firebase/database";

function ProfileView() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [bio, setBio] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");

  const handleEdit = () => {
    setBio(userData.bio);
    setProfilePicture(userData.profilePicture);
    setShowEdit(true);
  };

  useEffect(() => {
    if (user?.uid) {
      getUserByHandle(user.uid).then((snapshot) => {
        setUserData(snapshot.exists() ? snapshot.val() : null);
      });
    }
  }, [user]);

  const handleSubmit = () =>{
    update((ref(db, `/users/${user.uid}`)), {
      bio: bio,
    })
    setShowEdit(false);
  }
  return (
    <div>
      {userData && <button onClick={handleEdit}>Edit Bio</button>}
      <h1>Profile</h1>
      <p>Email: {user?.email}</p>
      <p>Username: {userData?.username}</p>
      {showEdit && (
        <div>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          <button onClick={() => handleSubmit()}>Save</button>
        </div>
      )}
      <p>Bio: {bio}</p>
    </div>
  );
}
export default ProfileView;
//profile picture , bio,username , email, list of posts, friends request , settings(edit profile , change password , delete account)
