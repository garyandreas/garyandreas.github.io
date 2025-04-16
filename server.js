const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth'); // Remove this line if no longer using basic auth for posts
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Setup storage for uploaded images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage: storage });

// Simple in-memory storage for blog posts and projects
let blogPosts = [];
let projects = [];

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
// Basic Auth middleware - replace 'admin' and 'password' with your credentials
app.use(basicAuth({
    users: { 'admin': 'password' },
    challenge: true,
    unauthorizedResponse: (req) => 'Unauthorized'
}));
*/

// Serve static files (your frontend)
app.use(express.static(path.join(__dirname)));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API to get blog posts
app.get('/api/posts', (req, res) => {
    res.json(blogPosts);
});

// API to add a blog post
app.post('/api/posts', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }
    const newPost = {
        id: Date.now(),
        title,
        content,
        date: new Date().toISOString()
    };
    blogPosts.push(newPost);
    res.status(201).json(newPost);
});

// API to get projects
app.get('/api/projects', (req, res) => {
    res.json(projects);
});

// API to add a project
app.post('/api/projects', (req, res) => {
    const { title, description, link } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }
    const newProject = {
        id: Date.now(),
        title,
        description,
        link: link || ''
    };
    projects.push(newProject);
    res.status(201).json(newProject);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
