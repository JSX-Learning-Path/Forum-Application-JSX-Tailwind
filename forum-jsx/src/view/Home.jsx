import React from "react";
import { onValue, orderByChild, query, ref } from "firebase/database";
import { useEffect, useState } from "react";
// import { getAllPosts } from "../service/posts";
import { db } from "../config/firebase-config";
// import { getAuth } from "firebase/auth";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // setLoading(true); // Add this line
    const postsRef = ref(db, "posts");
    const postsQuery = query(postsRef, orderByChild("createdAt"));

    const fetchPosts = onValue(
      postsQuery,
      (snapshot) => {
        const data = [];
        snapshot.forEach((childSnapshot) => {
          data.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setPosts(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      },
    );
    return () => fetchPosts();
  }, []);

  if (loading) return <p className="loading-msg">Loading posts...</p>;
  return (
    <div className="grid grid-rows-4 gap-4 p-4">
      <h2 className="text-2xl font-bold">Posts</h2>
      {posts.length === 0 && <p className="empty-msg">No posts published.</p>}
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p className="post-content">{post.content}</p>
            {post.picture && (
              <img src={post.picture} alt={post.title} className="post-image" />
            )}
            <div className="post-meta">
              <small>Author: {post.authorName}</small>
              {post.createdAt && (
                <small>
                  {new Date(post.createdAt).toLocaleDateString("bg-BG")}
                </small>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
