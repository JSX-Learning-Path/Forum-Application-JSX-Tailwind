import React from "react";
import { onValue, orderByChild, query, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../config/firebase-config";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    <div className="post-list-container">
      <h2>Posts</h2>
      {posts.length === 0 && <p className="empty-msg">No posts published.</p>}
      <div className="post-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p className="post-content">{post.content}</p>
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
