// ===== CONFIG =====
// WhatsApp number: country code, no "+" and no spaces
const WHATSAPP_NUMBER = "2349050526254";
const CONTACT_EMAIL = "philipadeyemo16@gmail.com";

// ===== Custom Cursor =====
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const isTouchDevice = window.matchMedia('(hover: none)').matches;

if (cursorDot && cursorOutline && !isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    });
}

// ===== Mobile Menu =====
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

function setMenu(open) {
    navLinks.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.innerHTML = open
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        setMenu(!navLinks.classList.contains('open'));
    });

    // Close the menu after tapping a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenu(false));
    });
}

// ===== Scroll Spy (highlight the active nav link) =====
const spySections = document.querySelectorAll('section[id]');
const spyLinks = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
    const scrollPos = window.scrollY + 140;
    let currentId = 'home';

    spySections.forEach(section => {
        if (scrollPos >= section.offsetTop) {
            currentId = section.id;
        }
    });

    // "why-choose" has no nav link, so keep About highlighted there
    if (currentId === 'why-choose') currentId = 'about';

    spyLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// ===== Sequential Reveal Animation Observer =====
document.addEventListener("DOMContentLoaded", () => {
    const elementsToReveal = document.querySelectorAll(
        '.hero-subtitle, .hero-title, .hero-description, .hero-stats, .hero-cta, ' +
        '.section-header, .glass-card, .service-item, .project-card, .contact-visual'
    );

    elementsToReveal.forEach(el => el.classList.add('reveal-init'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('reveal-active');
                observer.unobserve(el);

                // Remove the reveal classes once the animation is done, otherwise the
                // leftover transition-delay makes hover effects on cards feel laggy.
                setTimeout(() => {
                    el.classList.remove('reveal-init', 'reveal-active');
                }, 1300);
            }
        });
    }, { root: null, threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

    elementsToReveal.forEach(el => revealObserver.observe(el));
});

// ===== Interactive Service Tab Switcher =====
const serviceItems = document.querySelectorAll('.service-item');
const serviceDetailsList = document.getElementById('service-details-list');

const serviceData = [
    [
        "High-performance Single Page Apps (SPAs)",
        "Modern Tailwind & CSS3 Styling",
        "Firebase v9 Backend Integration",
        "Cross-browser Compatibility"
    ],
    [
        "Scalable Web App Architecture",
        "State Management & API Connectivity",
        "Secure Authentication & Firestore Integration",
        "Clean Modular Codebase"
    ],
    [
        "Pixel-perfect Figma to Code Conversion",
        "Interactive UI Micro-interactions",
        "Responsive Mobile-First Layouts",
        "Accessibility Standards (A11y)"
    ],
    [
        "Fluid Grid & Flexbox Optimization",
        "Performance Auditing & Load Speed Tuning",
        "Mobile Touch & Gesture Support",
        "Cross-device QA Testing"
    ]
];

function selectService(item, index) {
    serviceItems.forEach(i => {
        i.classList.remove('active');
        const icon = i.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-plus';
    });
    item.classList.add('active');
    const activeIcon = item.querySelector('i');
    if (activeIcon) activeIcon.className = 'fa-solid fa-minus';

    if (serviceDetailsList) {
        serviceDetailsList.style.opacity = '0';
        setTimeout(() => {
            serviceDetailsList.innerHTML = serviceData[index].map(detail => `
                <li><i class="fa-solid fa-circle"></i> ${detail}</li>
            `).join('');
            serviceDetailsList.style.opacity = '1';
        }, 150);
    }
}

serviceItems.forEach((item, index) => {
    item.addEventListener('click', () => selectService(item, index));
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectService(item, index);
        }
    });
});

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const emailBtn = document.getElementById('emailBtn');

function showStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status ${type || ''}`;
}

function getFormData() {
    const name = document.getElementById('visitorName').value.trim();
    const email = document.getElementById('visitorEmail').value.trim();
    const phone = document.getElementById('visitorPhone').value.trim();
    const message = document.getElementById('visitorMessage').value.trim();
    const services = Array.from(
        contactForm.querySelectorAll('input[name="service"]:checked')
    ).map(box => box.value);

    return { name, email, phone, message, services };
}

function buildMessage({ name, email, phone, message, services }) {
    const lines = [
        'New message from your portfolio website',
        '',
        `Name: ${name}`,
        `Email: ${email}`
    ];
    if (phone) lines.push(`Phone: ${phone}`);
    if (services.length) lines.push(`Interested in: ${services.join(', ')}`);
    lines.push('', 'Message:', message);
    return lines.join('\n');
}

if (contactForm) {
    // Send via WhatsApp
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            showStatus('Please fill in your name, a valid email and your message.', 'error');
            return;
        }

        const text = buildMessage(getFormData());
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

        window.open(url, '_blank', 'noopener');
        showStatus('Opening WhatsApp. Press send there to deliver your message.', 'success');

        setTimeout(() => contactForm.reset(), 800);
    });

    // Send via Email
    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                showStatus('Please fill in your name, a valid email and your message.', 'error');
                return;
            }

            const data = getFormData();
            const subject = `Portfolio enquiry from ${data.name}`;
            const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildMessage(data))}`;

            window.location.href = mailto;
            showStatus('Opening your email app...', 'success');
        });
    }
}

// ===== Newsletter (front-end only for now) =====
const newsletterForm = document.getElementById('newsletterForm');
const newsletterStatus = document.getElementById('newsletterStatus');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // TODO: connect to Firebase / Mailchimp / Formspree to actually store the email
        newsletterStatus.textContent = 'Thanks for subscribing!';
        newsletterForm.reset();
    });
}
