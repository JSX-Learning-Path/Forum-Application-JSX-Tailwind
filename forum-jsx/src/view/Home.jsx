import React from "react";
import {
  onValue,
  orderByChild,
  query,
  ref,
  remove,
  update,
} from "firebase/database";
import { useEffect, useState } from "react";
// import { getAllPosts } from "../service/posts";
import { db } from "../config/firebase-config";
import Comment from "../components/Comments.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase-config";
// import { getAuth } from "firebase/auth";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState({});
  const [countLiked, setCountLiked] = useState({});
  const [, isDeleted] = useState({});
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

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

  const handleEdit = async (postId, newData) => {
    const postRef = ref(db, `posts/${postId}`);
    await update(postRef, newData);
  };

  if (loading) return <p className="loading-msg">Loading posts...</p>;
  return (
    <div className="grid grid-col-2 gap-4 p-4 min-h-screen bg-gradient-to-r from-indigo-100/50 to-pink-100/30 ">
      <h2 className="text-4xl font-bold text-center text-gray-700 inset-0">
        Today's Posts
      </h2>
      {posts.length === 0 && <p className="empty-msg">No posts published.</p>}
      <div className="flex flex-col gap-4  ">
        {posts.map((post) => (
          <div
            key={post.id}
            className="post-card bg-gradient-to-r from-pink-100/20 to-indigo-100/30 shadow-lg p-4 rounded max-w-3xl "
          >
            {editingPostId === post.id ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleEdit(post.id, {
                    title: editTitle,
                    content: editContent,
                  });
                  setEditingPostId(null);
                }}
                className="flex flex-col gap-2  mx-auto w-full max-w-md"
              >
                <input
                  className="border p-1"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Heading"
                />
                <textarea
                  className="border p-1"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Content"
                />
                <div>
                  <button
                    type="submit"
                    className="bg-green-500 text-white py-1 px-2 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 py-1 px-2 rounded"
                    onClick={() => setEditingPostId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-5 bg-gradient-to-l from-pink-900/20 to-gray-700/70 bg-clip-text text-transparent">
                  {post.title}
                </h3>
                <small>Author: {post.authorName}</small>
                <p className="bg-gray-200/30 p-3  rounded">{post.content}</p>
                {post.picture && (
                  <img
                    src={post.picture}
                    alt={post.title}
                    className="post-image max-w-[150px] max-h-[150px] mt-10"
                  />
                )}
                <div className="post-meta mt-5 flex items-center justify-end">
                  {post.createdAt && (
                    <small>
                      {new Date(post.createdAt).toLocaleDateString("bg-BG")}
                    </small>
                  )}
                  <button
                    className="ml-4"
                    onClick={() => {
                      setIsLiked((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }));
                      setCountLiked((prev) => ({
                        ...prev,
                        [post.id]: prev[post.id]
                          ? prev[post.id] - 1
                          : (prev[post.id] || 0) + 1,
                      }));
                    }}
                  >
                    <span
                      className={
                        isLiked[post.id] ? "text-red-500" : "text-gray-400"
                      }
                    >
                      {isLiked[post.id] ? "❤️" : "🤍"}
                    </span>
                    <span className="ml-2">{countLiked[post.id]}</span>
                  </button>
                  {user && user.uid === post.authorId && (
                    <>
                      <button
                        className="ml-4 py-1 px-2 rounded bg-red-500/90 text-white"
                        onClick={async () => {
                          const postRef = ref(db, `posts/${post.id}`);
                          await remove(postRef);
                          isDeleted((prev) => ({ ...prev, [post.id]: true }));
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="ml-5 bg-blue-500 text-white py-1 px-2 rounded"
                        onClick={() => {
                          setEditingPostId(post.id);
                          setEditTitle(post.title);
                          setEditContent(post.content);
                        }}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500 font-medium">
                {post.comments ? Object.keys(post.comments).length : 0} коментара
              </span>
            </div>
            <Comment postId={post.id} postAuthorId={post.authorId} comments={post.comments || []} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
