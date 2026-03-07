import React, { useState } from "react";
import { ref, update, remove } from "firebase/database";
import { db } from "../config/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase-config";

const Reply = ({
  commentId,
  replyId,
  reply,
  postAuthorId,
  onEdit,
  onDelete,
  onHide,
}) => {
  const [user] = useAuthState(auth);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState(reply.content);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLike = async () => {
    if (!user) return;
    let likedBy = Array.isArray(reply.likedBy) ? [...reply.likedBy] : [];
    let disLikedBy = Array.isArray(reply.disLikedBy) ? [...reply.disLikedBy] : [];
    if (likedBy.includes(user.uid)) return;
    likedBy.push(user.uid);
    disLikedBy = disLikedBy.filter((id) => id !== user.uid);
    const replyRef = ref(db, `posts/${reply.postId}/comments/${commentId}/replies/${replyId}`);
    await update(replyRef, {
      likes: likedBy.length,
      likedBy,
      disLikedBy,
      disLikes: disLikedBy.length,
    });
  };

  const handleDislike = async () => {
    if (!user) return;
    let likedBy = Array.isArray(reply.likedBy) ? [...reply.likedBy] : [];
    let disLikedBy = Array.isArray(reply.disLikedBy) ? [...reply.disLikedBy] : [];
    if (disLikedBy.includes(user.uid)) return;
    disLikedBy.push(user.uid);
    likedBy = likedBy.filter((id) => id !== user.uid);
    const replyRef = ref(db, `posts/${reply.postId}/comments/${commentId}/replies/${replyId}`);
    await update(replyRef, {
      disLikes: disLikedBy.length,
      disLikedBy,
      likedBy,
      likes: likedBy.length,
    });
  };

  const handleEdit = async () => {
    if (editValue.trim() === "") return;
    const replyRef = ref(db, `posts/${reply.postId}/comments/${commentId}/replies/${replyId}`);
    await update(replyRef, { content: editValue });
    setEditMode(false);
    if (onEdit) onEdit();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      const replyRef = ref(db, `posts/${reply.postId}/comments/${commentId}/replies/${replyId}`);
      await remove(replyRef);
      if (onDelete) onDelete();
    }
  };

  const handleHide = async () => {
    const replyRef = ref(db, `posts/${reply.postId}/comments/${commentId}/replies/${replyId}`);
    await update(replyRef, { hidden: !reply.hidden });
    if (onHide) onHide();
  };

  return (
    <div className="bg-white border border-indigo-100 rounded p-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-indigo-600 text-xs">{reply.authorName}</span>
        {(user && (reply.authorId === user.uid || postAuthorId === user.uid)) && (
          <div className="relative">
            <button
              className="ml-2 text-gray-500 hover:text-gray-800 text-lg px-2 py-1 rounded-full focus:outline-none"
              onClick={() => setMenuOpen((prev) => !prev)}
              title="Още опции"
            >&#8942;</button>
            {menuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg flex flex-col">
                {user && reply.authorId === user.uid && !editMode && (
                  <button
                    className="text-left px-4 py-2 text-blue-600 hover:bg-blue-50 text-sm"
                    onClick={() => { setEditMode(true); setMenuOpen(false); }}
                  >Редактирай</button>
                )}
                {(user && (reply.authorId === user.uid || postAuthorId === user.uid)) && (
                  <button
                    onClick={handleDelete}
                    className="text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                    title="Изтрий отговора"
                  >Изтрий</button>
                )}
                {user && postAuthorId === user.uid && (
                  <button
                    onClick={handleHide}
                    className="text-left px-4 py-2 text-yellow-700 hover:bg-yellow-50 text-sm"
                  >{reply.hidden ? 'Покажи' : 'Скрий'}</button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {editMode ? (
        <div className="flex gap-2 mt-1">
          <input
            className="border rounded px-2 py-1 flex-1"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
          />
          <button className="text-green-600 font-bold" onClick={handleEdit}>Запази</button>
          <button className="text-gray-400 font-bold" onClick={() => setEditMode(false)}>Отказ</button>
        </div>
      ) : (
        <>
          <span className="ml-2 text-gray-700 text-sm">
            {reply.hidden && user && user.uid === postAuthorId && (
              <span className="text-yellow-700 text-xs mr-2">(Скрит отговор)</span>
            )}
            {reply.content}
          </span>
          <div className="text-xs text-gray-400 mt-1">
            {reply.createAt ? new Date(reply.createAt).toLocaleString('bg-BG', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
          </div>
        </>
      )}
      <div className="flex gap-2 mt-2 items-center">
        <button
          className={`text-xs px-2 py-1 rounded border ${reply.likedBy && user && reply.likedBy.includes(user.uid) ? 'bg-green-100 text-green-700 border-green-300' : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50'}`}
          onClick={handleLike}
          disabled={!user}
        >👍 {reply.likes || 0}</button>
        <button
          className={`text-xs px-2 py-1 rounded border ${reply.disLikedBy && user && reply.disLikedBy.includes(user.uid) ? 'bg-red-100 text-red-700 border-red-300' : 'bg-white text-gray-600 border-gray-300 hover:bg-red-50'}`}
          onClick={handleDislike}
          disabled={!user}
        >👎 {reply.disLikes || 0}</button>
      </div>
    </div>
  );
};

export default Reply;
