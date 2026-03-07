import React, { useState, useEffect } from "react";
import Reply from "./Reply";
import { onValue, remove, update } from "firebase/database";
import { auth, db } from "../config/firebase-config";
import { ref, push } from "firebase/database";
import Button from "./Button.jsx";
import { getUserByHandle } from "../service/users.js";
import { useAuthState } from "react-firebase-hooks/auth";

function Comments({ postId, postAuthorId }) {
  const [comments, setComment] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [replyValue, setReplyValue] = useState("");

    const handleAddReply = async (parentId) => {
      if (replyValue.trim() === "") return;
      const reply = {
        postId: postId,
        parentId,
        authorId: user?.uid || null,
        authorName:
          (userData && (userData.username || userData.displayName || userData.email)) ||
          (user && (user.displayName || user.email)) ||
          "Anonymous",
        content: replyValue,
        createAt: new Date().toISOString(),
        likes: 0,
        disLikes: 0,
        likedBy: [],
        disLikedBy: [],
        hidden: false,
      };
      const repliesRef = ref(db, `posts/${postId}/comments/${parentId}/replies`);
      await push(repliesRef, reply);
      setReplyTo(null);
      setReplyValue("");
    };
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [menuOpen, setMenuOpen] = useState({});
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
      postId: postId,
      authorId: user?.uid || null,
      authorName:
        (userData && (userData.username || userData.displayName || userData.email)) ||
        (user && (user.displayName || user.email)) ||
        "Anonymous",
      content: newComment,
      createAt: new Date().toISOString(),
      likes: 0,
      disLikes: 0,
      likedBy: [],
      disLikedBy: [],
      hidden: false,
    };
    const commentsRef = ref(db, `posts/${postId}/comments`);
    await push(commentsRef, comment);
    setNewComment("");
  };
  const handleHideComment = async (commentId, hide) => {
    const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);
    await update(commentRef, { hidden: hide });
  };

  const handleEditComment = async (commentId) => {
    if (editValue.trim() === "") return;
    const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);
    await import('firebase/database').then(({ update }) =>
      update(commentRef, { content: editValue })
    );
    setEditId(null);
    setEditValue("");
  };

  const handleLike = async (comment) => {
    if (!user) return;
    const commentRef = ref(db, `posts/${postId}/comments/${comment.id}`);
    let likedBy = Array.isArray(comment.likedBy) ? [...comment.likedBy] : [];
    let disLikedBy = Array.isArray(comment.disLikedBy) ? [...comment.disLikedBy] : [];
    if (likedBy.includes(user.uid)) return;
    likedBy.push(user.uid);
    disLikedBy = disLikedBy.filter((id) => id !== user.uid);
    await update(commentRef, {
      likes: likedBy.length,
      likedBy,
      disLikedBy,
      disLikes: disLikedBy.length
    });
  };

  const handleDislike = async (comment) => {
    if (!user) return;
    const commentRef = ref(db, `posts/${postId}/comments/${comment.id}`);
    let likedBy = Array.isArray(comment.likedBy) ? [...comment.likedBy] : [];
    let disLikedBy = Array.isArray(comment.disLikedBy) ? [...comment.disLikedBy] : [];
    if (disLikedBy.includes(user.uid)) return;
    disLikedBy.push(user.uid);
    likedBy = likedBy.filter((id) => id !== user.uid);
    await update(commentRef, {
      disLikes: disLikedBy.length,
      disLikedBy,
      likedBy,
      likes: likedBy.length
    });
  };


  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      const commentRef = ref(db, `posts/${postId}/comments/${commentId}`);
      await remove(commentRef);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold mb-4 text-indigo-700">Коментари</h3>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Напиши коментар..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50"
        />
        <Button onClick={handleAddComment} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded shadow">
          Изпрати
        </Button>
      </div>
      <div className="space-y-4">
        {comments.length === 0 && (
          <div className="text-gray-400 text-center">Все още няма коментари.</div>
        )}
        {[...comments]
          .sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
          .filter((comment) => {
            if (!comment.hidden) return true;
            if (!user) return false;
            return user.uid === postAuthorId || user.uid === comment.authorId;
          })
          .map((comment) => (
            <div
              key={comment.id}
              className={`flex items-start gap-3 bg-indigo-50 rounded-lg p-3 border border-indigo-100 shadow-sm`}
            >
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-indigo-700 text-sm">{comment.authorName}</span>
                  {(user && (comment.authorId === user.uid || postAuthorId === user.uid)) && (
                    <div className="relative">
                      <button
                        className="ml-2 text-gray-500 hover:text-gray-800 text-lg px-2 py-1 rounded-full focus:outline-none"
                        onClick={() => setMenuOpen((prev) => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                        title="Още опции"
                      >
                        &#8942;
                      </button>
                      {menuOpen[comment.id] && (
                        <div className="absolute right-0 z-10 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg flex flex-col">
                          {user && comment.authorId === user.uid && editId !== comment.id && (
                            <button
                              className="text-left px-4 py-2 text-blue-600 hover:bg-blue-50 text-sm"
                              onClick={() => { setEditId(comment.id); setEditValue(comment.content); setMenuOpen((prev) => ({ ...prev, [comment.id]: false })); }}
                            >Редактирай</button>
                          )}
                          {(user && (comment.authorId === user.uid || postAuthorId === user.uid)) && (
                            <button
                              onClick={() => { handleDeleteComment(comment.id); setMenuOpen((prev) => ({ ...prev, [comment.id]: false })); }}
                              className="text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                              title="Изтрий коментара"
                            >Изтрий</button>
                          )}
                          {user && postAuthorId === user.uid && (
                            <button
                              onClick={() => { handleHideComment(comment.id, !comment.hidden); setMenuOpen((prev) => ({ ...prev, [comment.id]: false })); }}
                              className="text-left px-4 py-2 text-yellow-700 hover:bg-yellow-50 text-sm"
                            >{comment.hidden ? 'Покажи' : 'Скрий'}</button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {editId === comment.id ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      className="border rounded px-2 py-1 flex-1"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                    />
                    <button className="text-green-600 font-bold" onClick={() => handleEditComment(comment.id)}>Запази</button>
                    <button className="text-gray-400 font-bold" onClick={() => setEditId(null)}>Отказ</button>
                  </div>
                ) : (
                  <span className="text-gray-800 text-base break-words">
                    {comment.hidden && user && user.uid === postAuthorId && (
                      <span className="text-yellow-700 text-xs mr-2">(Скрит коментар)</span>
                    )}
                    {comment.content}
                  </span>
                )}
                <div className="flex gap-2 mt-2 items-center">
                  <button
                    className={`text-xs px-2 py-1 rounded border ${comment.likedBy && user && comment.likedBy.includes(user.uid) ? 'bg-green-100 text-green-700 border-green-300' : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50'}`}
                    onClick={() => handleLike(comment)}
                    disabled={!user}
                  >👍 {comment.likes || 0}</button>
                  <button
                    className={`text-xs px-2 py-1 rounded border ${comment.disLikedBy && user && comment.disLikedBy.includes(user.uid) ? 'bg-red-100 text-red-700 border-red-300' : 'bg-white text-gray-600 border-gray-300 hover:bg-red-50'}`}
                    onClick={() => handleDislike(comment)}
                    disabled={!user}
                  >👎 {comment.disLikes || 0}</button>
                  <button
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1 rounded border border-indigo-200 bg-indigo-50 transition"
                    onClick={() => setReplyTo(comment.id)}
                  >Отговори</button>
                </div>
                {replyTo === comment.id && (
                  <div className="flex gap-2 mt-2">
                    <input
                      className="border rounded px-2 py-1 flex-1"
                      value={replyValue}
                      onChange={e => setReplyValue(e.target.value)}
                      placeholder="Въведи отговор..."
                    />
                    <button className="text-green-600 font-bold" onClick={() => handleAddReply(comment.id)}>Изпрати</button>
                    <button className="text-gray-400 font-bold" onClick={() => { setReplyTo(null); setReplyValue(""); }}>Отказ</button>
                  </div>
                )}
                {/* replies */}
                {comment.replies && (
                  <div className="ml-6 mt-2 space-y-2">
                    {Object.entries(comment.replies)
                      .filter(([, reply]) => {
                        if (!reply.hidden) return true;
                        if (!user) return false;
                        return user.uid === postAuthorId || user.uid === reply.authorId;
                      })
                      .map(([replyId, reply]) => (
                        <Reply
                          key={replyId}
                          commentId={comment.id}
                          replyId={replyId}
                          reply={reply}
                          postAuthorId={postAuthorId}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Comments;
