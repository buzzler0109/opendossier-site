// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 35, 0.98)';
    } else {
        header.style.background = 'rgba(10, 10, 35, 0.95)';
    }
});

// Product card click handlers
document.addEventListener('DOMContentLoaded', () => {
    // OpenWebUI + OpenDossier button
    const webUIButton = document.querySelector('.product-card:first-child .product-button');
    if (webUIButton) {
        webUIButton.addEventListener('click', () => {
            alert('OpenWebUI Demo будет доступен после развертывания!');
        });
    }

    // Local Obsidian + Copilot + S3 button (invite-only)
    const obsidianButton = document.querySelector('.product-card.featured .product-button');
    if (obsidianButton) {
        obsidianButton.addEventListener('click', () => {
            alert('Invite-only доступ! Скоро будет готова система приглашений.');
        });
    }

    // n8n Workflows button
    const n8nButton = document.querySelector('.product-card:last-child .product-button');
    if (n8nButton) {
        n8nButton.addEventListener('click', () => {
            alert('n8n Workflows будут доступны после настройки!');
        });
    }

    // Main CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            document.querySelector('#products').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe product cards for animation
document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Laptop mockup interaction
const laptopMockup = document.querySelector('.laptop-mockup');
if (laptopMockup) {
    laptopMockup.addEventListener('mouseenter', () => {
        laptopMockup.style.transform = 'rotateY(-10deg) rotateX(5deg) scale(1.05)';
    });
    
    laptopMockup.addEventListener('mouseleave', () => {
        laptopMockup.style.transform = 'rotateY(-15deg) rotateX(10deg) scale(1)';
    });
}

// Enhanced mobile menu functionality
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.textContent = '☰';
            }
        });
        
        // Close menu when clicking nav links
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.textContent = '☰';
            });
        });
    }
}

// Initialize mobile menu
initMobileMenu(); 