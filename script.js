document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const closeMenu = document.getElementById('close-menu');

    // Improved menu handling
    const toggleMenu = () => {
        const isExpanded = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        if (!isExpanded) {
            navMenu.removeAttribute('hidden');
        } else {
            setTimeout(() => {
                navMenu.setAttribute('hidden', '');
            }, 300); // match this with CSS transition time
        }
    };

    hamburger.addEventListener('click', toggleMenu);
    closeMenu.addEventListener('click', toggleMenu);

    // Close menu when clicking on navigation links
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });

    // Intersection Observer for fade effects
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // Optional: remove class when section is out of view
                // entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    // Observe all sections except home
    document.querySelectorAll('section:not(#home)').forEach(section => {
        section.classList.add('fade-section');
        observer.observe(section);
    });

    // Project link and preview functionality
    const projectLink = document.getElementById('projectLink');
    const projectPreview = document.getElementById('projectPreview');
    
    // Function to update project preview
    function updateProjectPreview(link) {
        if (link) {
            // Try to get preview image from link
            fetch(`https://api.urlmeta.org/?url=${encodeURIComponent(link)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.image) {
                        projectPreview.src = data.image;
                    } else {
                        projectPreview.src = 'path/to/default/image.jpg'; // Set a default image
                    }
                })
                .catch(error => {
                    console.error('Error fetching preview:', error);
                    projectPreview.src = 'path/to/default/image.jpg'; // Set a default image on error
                });
            
            projectLink.href = link;
        }
    }

    // Example usage - replace with your actual project link
    updateProjectPreview('https://github.com/garyandreas/garyandreas.github.io/blob/main/UTS/LAPORAN%20UTS%20SISTEM%20MULTIMEDIA.pdf');
});