import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ Connection Error:", err));


const postSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [
    {
      author: String,
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model("Post", postSchema);

// --- API ROUTES ---

// 1. Get all posts (Sorted by newest first)
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch posts" });
  }
});

// 2. Create a new post
app.post("/api/posts", async (req, res) => {
  const { author, content } = req.body;
  try {
    const newPost = new Post({ author, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ error: "Error creating post" });
  }
});

// 3. Vote (Like/Dislike) - Uses an Atomic Update ($inc)
app.post("/api/posts/:id/vote", async (req, res) => {
  const { type } = req.body;
  const update = type === 'like' ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };

  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(updatedPost);
  } catch (err) {
    res.status(404).json({ error: "Post not found" });
  }
});

// 4. Add a comment
app.post("/api/posts/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      post.comments.push({ author: req.body.author, text: req.body.text });
      await post.save();
      res.status(201).json(post);
    }
  } catch (err) {
    res.status(404).json({ error: "Post not found" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));