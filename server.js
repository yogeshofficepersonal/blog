const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images

mongoose.connect('your_mongodb_connection_string', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Blog Post Schema
const PostSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String
});

const Post = mongoose.model('Post', PostSchema);

// API to upload image and save blog post
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const newPost = new Post({ title, content, image: imagePath });
        await newPost.save();

        res.json({ message: "Post uploaded successfully!", post: newPost });
    } catch (error) {
        res.status(500).json({ error: "Error uploading post" });
    }
});

// API to get all posts
app.get('/posts', async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

app.listen(4000, () => console.log("🚀 Server running on http://localhost:4000"));

const cors = require("cors");
app.use(cors());