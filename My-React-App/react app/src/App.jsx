import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

  const API_URL = "http://localhost:5000/api/posts";

  // Fetch posts on load
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (user.trim()) setIsLoggedIn(true);
  };

  const handlePost = async () => {
    if (!newPostContent.trim()) return;
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: user, content: newPostContent })
    });
    const newPost = await res.json();
    setPosts([newPost, ...posts]);
    setNewPostContent("");
  };

  const handleVote = async (id, type) => {
    await fetch(`${API_URL}/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    // Refresh posts to update UI
    const res = await fetch(API_URL);
    setPosts(await res.json());
  };

  const handleComment = async (id) => {
    const text = commentInputs[id];
    if (!text?.trim()) return;

    await fetch(`${API_URL}/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: user, text })
    });

    // Clear input and refresh
    setCommentInputs({ ...commentInputs, [id]: "" });
    const res = await fetch(API_URL);
    setPosts(await res.json());
  };

  // --- LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Social Online Forum</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter your name"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <button type="submit">Enter</button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN FORUM SCREEN ---
  return (
    <div className={`forum-container ${darkMode ? 'dark' : ''}`}>
      <div className="forum-wrapper">
        <header>
          <h2>Welcome, {user}</h2>
          <div className="header-actions">
            <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>Logout</button>
          </div>
        </header>

        <div className="create-post">
          <textarea
            placeholder="Share your thoughts..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button className="post-btn" onClick={handlePost}>Post</button>
        </div>

        <div className="feed">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <h3>{post.author}</h3>
              <p>{post.content}</p>

              <div className="vote-buttons">
                <button className="like-btn" onClick={() => handleVote(post.id, 'like')}>👍 {post.likes}</button>
                <button className="dislike-btn" onClick={() => handleVote(post.id, 'dislike')}>👎 {post.dislikes}</button>
              </div>

              <div className="comment-section">
                <div className="comment-input-row">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) => setCommentInputs({...commentInputs, [post.id]: e.target.value})}
                  />
                  <button className="comment-btn" onClick={() => handleComment(post.id)}>Comment</button>
                </div>

                {post.comments.map((c, i) => (
                  <p key={i} className="comment-text"><strong>{c.author}:</strong> {c.text}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;