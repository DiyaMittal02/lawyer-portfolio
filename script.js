// ==================== NAVIGATION FUNCTIONALITY ====================
const navbar = document.getElementById('navbar');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== STATS COUNTER ANIMATION ====================
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, 0, target, 2000);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to elements
const animateOnScroll = document.querySelectorAll('.practice-card, .result-card, .testimonial-card, .resource-card, .credential-item');
animateOnScroll.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// ==================== CONTACT FORM HANDLING ====================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            caseType: document.getElementById('caseType').value,
            message: document.getElementById('message').value,
            urgent: document.getElementById('urgent').checked
        };

        // Show loading notification
        showNotification('Sending your consultation request...', 'info');

        try {
            // TODO: Replace 'YOUR_FORM_ID' with your actual Formspree form ID
            // Get your form ID from: https://formspree.io/
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    caseType: formData.caseType,
                    message: formData.message,
                    urgent: formData.urgent ? 'YES - URGENT' : 'No',
                    _subject: `New Consultation Request from ${formData.firstName} ${formData.lastName}`,
                })
            });

            if (response.ok) {
                showNotification('✓ Consultation request sent successfully! We will contact you within 24 hours.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Failed to send');
            }
        } catch (error) {
            showNotification('⚠ Failed to send request. Please email us directly or try again.', 'error');
            console.error('Form submission error:', error);
        }
    });
}

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };

    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };

    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icons[type] || 'check-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.success};
        color: white;
        padding: 20px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 15px;
        font-weight: 500;
    }
    
    .notification-content i {
        font-size: 20px;
    }
`;
document.head.appendChild(style);

// ==================== FLOATING INPUT LABELS ====================
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
formInputs.forEach(input => {
    // Add placeholder attribute for CSS selector
    input.setAttribute('placeholder', ' ');

    // Add focus/blur handlers for additional effects
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// ==================== PARALLAX EFFECT ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');

    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ==================== LAZY LOADING IMAGES ====================
// Create placeholder images
const createPlaceholderImage = (width, height, text) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1a2b4a');
    gradient.addColorStop(1, '#2d4a7c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add text
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);

    return canvas.toDataURL();
};

// Set placeholder images
const lawyerPhoto = document.getElementById('lawyerPhoto');
const courtroomPhoto = document.getElementById('courtroomPhoto');

if (lawyerPhoto) {
    lawyerPhoto.src = createPlaceholderImage(500, 600, 'Attorney Photo');
    lawyerPhoto.alt = 'Jonathan Hayes - Criminal Defense Attorney';
}

if (courtroomPhoto) {
    courtroomPhoto.src = createPlaceholderImage(550, 550, 'Courtroom');
    courtroomPhoto.alt = 'Professional Attorney in Court';
}

// ==================== TYPING EFFECT FOR HERO ====================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ==================== ACTIVE SECTION HIGHLIGHTING ====================
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// Add active class styling
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
    .nav-links a.active:not(.cta-nav) {
        color: var(--accent-gold) !important;
    }
    
    .navbar.scrolled .nav-links a.active:not(.cta-nav) {
        color: var(--accent-gold) !important;
    }
`;
document.head.appendChild(activeNavStyle);

// ==================== CURSOR EFFECT (OPTIONAL PREMIUM FEATURE) ====================
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid var(--accent-gold);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s ease, opacity 0.2s ease;
    opacity: 0;
`;

document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
    cursor.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

// Enlarge cursor on hover over clickable elements
const clickableElements = document.querySelectorAll('a, button, .practice-card, .result-card, .testimonial-card');
clickableElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursor.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
    });

    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.backgroundColor = 'transparent';
    });
});

// ==================== PRELOADER ====================
window.addEventListener('load', () => {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <i class="fas fa-balance-scale fa-3x"></i>
            <div class="loading-bar"></div>
        </div>
    `;

    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0f1419 0%, #1a2b4a 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        transition: opacity 0.5s ease, visibility 0.5s ease;
    `;

    const preloaderStyle = document.createElement('style');
    preloaderStyle.textContent = `
        .preloader-content {
            text-align: center;
            color: var(--accent-gold);
        }
        
        .preloader-content i {
            animation: scaleIn 1s infinite alternate;
        }
        
        .loading-bar {
            width: 200px;
            height: 4px;
            background: rgba(212, 175, 55, 0.2);
            border-radius: 2px;
            margin-top: 30px;
            overflow: hidden;
        }
        
        .loading-bar::after {
            content: '';
            display: block;
            width: 50%;
            height: 100%;
            background: var(--accent-gold);
            animation: loading 1.5s infinite;
        }
        
        @keyframes scaleIn {
            from { transform: scale(1); }
            to { transform: scale(1.2); }
        }
        
        @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
        }
    `;
    document.head.appendChild(preloaderStyle);

    // Remove preloader after a short delay
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => preloader.remove(), 500);
    }, 1500);

    document.body.insertBefore(preloader, document.body.firstChild);
});

// ==================== TESTIMONIAL SLIDER ENHANCEMENT ====================
const testimonialCards = document.querySelectorAll('.testimonial-card');
let currentTestimonial = 0;

// Add auto-highlight effect
setInterval(() => {
    testimonialCards.forEach((card, index) => {
        card.style.transform = index === currentTestimonial ? 'scale(1.05)' : 'scale(1)';
        card.style.boxShadow = index === currentTestimonial
            ? '0 20px 60px rgba(212, 175, 55, 0.3)'
            : '0 4px 16px rgba(0, 0, 0, 0.15)';
    });

    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
}, 3000);

// ==================== SCROLL TO TOP BUTTON ====================
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--gradient-gold);
    border: none;
    border-radius: 50%;
    color: var(--primary-blue);
    font-size: 20px;
    cursor: pointer;
    box-shadow: var(--shadow-lg);
    opacity: 0;
    visibility: hidden;
    transition: var(--transition-smooth);
    z-index: 999;
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'translateY(-5px) scale(1.1)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'translateY(0) scale(1)';
});

// ==================== CONSOLE BRANDING ====================
console.log('%c⚖️ Deepanshu Mittal - Criminal Defense Lawyer', 'font-size: 20px; font-weight: bold; color: #d4af37;');
console.log('%cYour Rights Matter, Your Defense Matters', 'font-size: 14px; color: #1a2b4a;');
console.log('%cContact: +91 99999-99999', 'font-size: 12px; color: #6b7280;');

// ==================== MODAL FUNCTIONALITY ====================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close modal when clicking outside the modal content
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});
