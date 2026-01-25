import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../config/firebase-config";
import { ref, push } from "firebase/database";
import React from "react";

function Create() {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(title.trim() === "" || content.trim() === ""){
        setError("Title and Content cannot be empty."); 
        return;
    }
    setLoading(true);
    setError("");
    try{
      const postRef = ref(db,"posts")
      await push(postRef,{
        title,
        content,
        authorId: user?.uid || null,
        authorName: user?.displayName || "Anonymous",
        createAt: new Date().toISOString()
      });
      setTitle("");
      setContent("");
      setError("");
    }catch(error){
        setError(`Failed to create post. ${error.message}`);
    } finally {
        setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 p-2 border"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full mb-2 p-2 border"
      />
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white">
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}

export default Create;
