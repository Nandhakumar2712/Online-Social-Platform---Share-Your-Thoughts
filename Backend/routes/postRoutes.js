const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Create post
router.post("/", async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json(post);
});

// Get all posts
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Like post
router.put("/like/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.likes += 1;
  await post.save();
  res.json(post);
});

// Add comment
router.post("/comment/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push(req.body);
  await post.save();
  res.json(post);
});

// Dislike post
router.put("/dislike/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.dislikes += 1;
  await post.save();
  res.json(post);
});

module.exports = router;
