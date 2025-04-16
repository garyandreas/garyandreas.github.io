document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('postsContainer');

    const projectForm = document.getElementById('projectForm');
    const projectsContainer = document.querySelector('.projects-container');

    const loginForm = document.getElementById('loginForm');
    const loginContainer = document.getElementById('loginContainer');

    // Hide forms initially
    postForm.style.display = 'none';
    projectForm.style.display = 'none';

    // Load existing posts and projects from backend
    async function loadPosts() {
        try {
            const res = await fetch('/api/posts', { credentials: 'include' });
            if (res.status === 401) {
                // Unauthorized, do not load posts
                postsContainer.innerHTML = '<p>Please login to view posts.</p>';
                return;
            }
            const posts = await res.json();
            postsContainer.innerHTML = '';
            posts.forEach(post => {
                const article = document.createElement('article');
                article.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <small>Posted on: ${new Date(post.date).toLocaleDateString()}</small>
                `;
                postsContainer.appendChild(article);
            });
        } catch (err) {
            console.error('Failed to load posts', err);
        }
    }

    async function loadProjects() {
        try {
            const res = await fetch('/api/projects', { credentials: 'include' });
            if (res.status === 401) {
                // Unauthorized, do not load projects
                projectsContainer.innerHTML = '<p>Please login to view projects.</p>';
                return;
            }
            const projects = await res.json();
            projectsContainer.innerHTML = '';
            projects.forEach(project => {
                const card = document.createElement('div');
                card.classList.add('project-card');
                card.innerHTML = `
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    ${project.link ? `<p><a href="${project.link}" target="_blank" rel="noopener noreferrer">Project Link</a></p>` : ''}
                    ${project.image ? `<img src="${project.image}" alt="${project.title} preview" style="max-width: 100%; border-radius: 8px; margin-top: 10px;" />` : ''}
                `;
                projectsContainer.appendChild(card);
            });
        } catch (err) {
            console.error('Failed to load projects', err);
        }
    }

    // Submit new post
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = postForm.postTitle.value.trim();
        const content = postForm.postContent.value.trim();
        if (!title || !content) {
            alert('Please fill in both title and content.');
            return;
        }
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title, content })
            });
            if (res.ok) {
                postForm.reset();
                loadPosts();
            } else if (res.status === 401) {
                alert('Unauthorized. Please login.');
            } else {
                alert('Failed to add post.');
            }
        } catch (err) {
            alert('Error adding post.');
            console.error(err);
        }
    });

    // Submit new project
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = projectForm.projectTitle.value.trim();
        const description = projectForm.projectDescription.value.trim();
        const link = projectForm.projectLink.value.trim();
        const imageFile = projectForm.projectImageUpload.files[0];
        if (!title || !description) {
            alert('Please fill in both title and description.');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('link', link);
            if (imageFile) {
                formData.append('projectImageUpload', imageFile);
            }
            const res = await fetch('/api/projects', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            if (res.ok) {
                projectForm.reset();
                loadProjects();
            } else if (res.status === 401) {
                alert('Unauthorized. Please login.');
            } else {
                alert('Failed to add project.');
            }
        } catch (err) {
            alert('Error adding project.');
            console.error(err);
        }
    });

    // Handle login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = loginForm.username.value.trim();
        const password = loginForm.password.value.trim();
        if (!username || !password) {
            alert('Please enter username and password.');
            return;
        }
        // Test authentication by fetching posts with basic auth header
        try {
            const res = await fetch('/api/posts', {
                headers: {
                    'Authorization': 'Basic ' + btoa(username + ':' + password)
                }
            });
            if (res.ok) {
                // Authentication successful
                loginContainer.style.display = 'none';
                postForm.style.display = 'block';
                projectForm.style.display = 'block';

                // Set global fetch to include auth header
                window.authHeader = 'Basic ' + btoa(username + ':' + password);

                // Override fetch to include auth header
                const originalFetch = window.fetch;
                window.fetch = (input, init = {}) => {
                    init.headers = init.headers || {};
                    init.headers['Authorization'] = window.authHeader;
                    return originalFetch(input, init);
                };

                loadPosts();
                loadProjects();
            } else {
                alert('Invalid username or password.');
            }
        } catch (err) {
            alert('Error during login.');
            console.error(err);
        }
    });

    // Initial load without authentication
    loadPosts();
    loadProjects();
})