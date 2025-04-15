const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!isExpanded));
    if (navMenu.hasAttribute('hidden')) {
        navMenu.removeAttribute('hidden');
    } else {
        navMenu.setAttribute('hidden', '');
    }
    navMenu.classList.toggle('active');
});

// Function to reveal sections on scroll with fade-in and slide-up effect
function revealSections() {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= windowHeight * 0.85) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        } else {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
        }
    });
}

window.addEventListener('scroll', revealSections);
window.addEventListener('load', revealSections);
