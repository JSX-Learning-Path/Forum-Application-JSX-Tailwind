import React, { useState, useEffect } from "react";
import { onValue, remove } from "firebase/database";
import { auth, db } from "../config/firebase-config";
import { ref, push } from "firebase/database";
import Button from "./Button.jsx";
import { getUserByHandle } from "../service/users.js";
import { useAuthState } from "react-firebase-hooks/auth";

function Comments({ postId }) {
  const [comments, setComment] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userData, setUserData] = useState(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (postId) {
      const commentsRef = ref(db, `posts/${postId}/comments`);
      const unSubscribe = onValue(commentsRef, (snapshot) => {
        const data = snapshot.val();
        const arr = data
          ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
          : [];
        setComment(arr);
      });
      return () => unSubscribe();
    }
  }, [postId]);

  useEffect(() => {
    if (user?.uid) {
      getUserByHandle(user.uid).then((snapshot) => {
        const data = snapshot.exists() ? snapshot.val() : null;
        setUserData(data);
      });
    }
  }, [user?.uid]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    const comment = {
      id: Date.now().toString(),
      postId: postId,
      author: userData ? userData.displayName : "Anonymous",
      content: newComment,
      createAt: new Date().toISOString(),
      likes: 0,
      disLikes: 0,
      likedBy: [],
      disLikedBy: [],
    };
    const commentsRef = ref(db, `posts/${postId}/comments`);
    await push(commentsRef, comment);
    setNewComment("");
  };
  const handleDeleteComment = async (commentId) => {
    const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);
    await remove(commentRef);
  };

  return (
    <div>
      <h3>Comment</h3>

      <div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Place your comment"
        />
        <Button onClick={handleAddComment}>Submit</Button>
      </div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <span>{comment.author}</span>
          <span>{comment.content}</span>
          <Button onClick={() => handleDeleteComment(comment.id)}>
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
}

export default Comments;
