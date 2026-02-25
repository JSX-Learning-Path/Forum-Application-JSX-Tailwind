import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../config/firebase-config";
import { ref, push, update } from "firebase/database";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getUserByHandle } from "../service/users";
import { getStorage } from "firebase/storage";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

function Create() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [pictureFile, setPictureFile] = useState(null);
  const [userData, setUserData] = useState(null);
  // const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      getUserByHandle(user.uid).then((snapshot) => {
        const data = snapshot.exists() ? snapshot.val() : null;
        setUserData(data);
        // setBio(data?.bio || "");
        setProfilePicture(data?.profilePicture || "");
      });
    }
  }, [user]);
  const handleUpload = (e) => {
    setPictureFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === "" || content.trim() === "") {
      toast.error("Title and Content cannot be empty.");
      let profilePicUrl = profilePicture;
      if (pictureFile) {
        const storage = getStorage();
        const picRef = storageRef(storage, `profilePictures/${user.uid}`);
        await uploadBytes(picRef, pictureFile);
        profilePicUrl = await getDownloadURL(picRef);
      }
      await update(ref(db, `/users/${user.uid}`), {
        // bio: bio,
        profilePicture: profilePicUrl,
      });
      setProfilePicture(profilePicUrl);
      // setShowEdit(false);
      setPictureFile(null);
      return;
    }

    // const handleEdit = () => {
    //   // setBio(userData?.bio || "");
    //   setProfilePicture(userData?.profilePicture || "");
    //   setShowEdit(true);
    // };

    setLoading(true);
    try {
      let postPictureUrl = "";
      if (pictureFile) {
        const storage = getStorage();
        const picRef = storageRef(storage, `posts/${user.uid}_${Date.now()}`);
        await uploadBytes(picRef, pictureFile);
        postPictureUrl = await getDownloadURL(picRef);
      }
      const postRef = ref(db, "posts");
      await push(postRef, {
        title,
        content,
        authorId: user?.uid || null,
        authorName: userData?.username || "Anonymous",
        authorProfilePicture: userData?.profilePicture || "",
        picture: postPictureUrl,
        createAt: new Date().toISOString(),
      });
      setTitle("");
      setContent("");
      setError("");
      toast.success("Post created successfully!");
      navigate("/");
    } catch (error) {
      setError(`Failed to create post. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto h-130 mt-10 border-1 rounded-lg p-5 "
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Create a Post</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 p-2 border "
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full mb-2 p-2 border resize-none font-medium"
      />
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Attachment (optional)</label>
        <label
          className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-6 cursor-pointer transition hover:bg-blue-100"
          htmlFor="file-upload"
        >
          {/* Icon */}
          <svg
            className="w-10 h-10 text-blue-400 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16v-8m0 0l-3 3m3-3l3 3M20 16.58A5 5 0 0012 21a5 5 0 01-8-4.42V7a5 5 0 018-4.42A5 5 0 0120 7v9.58z"
            />
          </svg>
          <span className="text-blue-500 font-semibold underline">Choose File</span>
          <span className="text-gray-400 text-xs mt-1">Max file size: 25 MB</span>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>
      <div className="grid grid-rows-2 items-center gap-2 ">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded cursor-pointer"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}

export default Create;
