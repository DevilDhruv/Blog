/**
 * Dev Chronicles - Interactive Features
 * Handles scroll animations, form submission, and smooth interactions
 */

// ============================================================================
// SCROLL FADE-IN ANIMATIONS
// ============================================================================

/**
 * Observe elements and add fade-in animation when they enter viewport
 */
function initScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return;

    const elements = document.querySelectorAll('.post-card, .category-card');
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for multiple elements
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 100);
                
                // Stop observing this element
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// ============================================================================
// FORM SUBMISSION HANDLER
// ============================================================================

/**
 * Handle subscribe form submission
 * Submits data to Google Forms or Google Apps Script
 */
function initFormHandler() {
    const form = document.getElementById('subscribeForm');
    const messageEl = document.getElementById('formMessage');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const email = form.querySelector('.email-input').value.trim();
        const selectedTopics = Array.from(form.querySelectorAll('input[name="topics"]:checked'))
            .map(checkbox => checkbox.value);

        // Clear previous message
        messageEl.textContent = '';
        messageEl.className = '';

        // Validate email
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        try {
            // Show loading state
            const submitBtn = form.querySelector('.submit-button');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;

            // Send data to Google Forms or Google Apps Script
            // Replace this URL with your Google Forms endpoint or Google Apps Script deployment URL
            const googleFormsUrl = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
            
            const formData = new FormData();
            // Replace field names with your actual Google Form field names
            formData.append('entry.YOUR_EMAIL_FIELD_ID', email);
            formData.append('entry.YOUR_TOPICS_FIELD_ID', selectedTopics.join(', '));

            // Send request with no-cors mode to avoid CORS issues
            const response = await fetch(googleFormsUrl, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            });

            // Reset form
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Show success message
            showMessage('✓ Successfully subscribed! Check your email for confirmation.', 'success');

        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('✗ Something went wrong. Please try again.', 'error');
            
            const submitBtn = form.querySelector('.submit-button');
            submitBtn.textContent = 'Subscribe';
            submitBtn.disabled = false;
        }
    });

    /**
     * Validate email format
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Show form message with type (success/error)
     */
    function showMessage(text, type) {
        messageEl.textContent = text;
        messageEl.className = `form-message ${type}`;
    }
}

// ============================================================================
// SMOOTH SCROLL NAVIGATION
// ============================================================================

/**
 * Enhance smooth scrolling for navigation links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if no target or is just '#'
            if (href === '#' || href === '') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================================================
// ACTIVE NAVIGATION INDICATOR
// ============================================================================

/**
 * Update active navigation link based on scroll position
 */
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all interactive features when DOM is ready
 */
function initApp() {
    // Initialize features
    initScrollAnimations();
    initFormHandler();
    initSmoothScroll();
    initActiveNavigation();

    // Log initialization
    console.log('✓ Dev Chronicles blog initialized');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// ============================================================================
// GOOGLE FORMS INTEGRATION GUIDE
// ============================================================================

/**
 * HOW TO INTEGRATE WITH GOOGLE FORMS:
 * 
 * 1. Create a Google Form with fields:
 *    - Email address (short answer)
 *    - Topics of interest (checkboxes: DSA, JavaScript, Career, Notes)
 * 
 * 2. Get form IDs:
 *    - Open form in edit mode
 *    - In browser console, run:
 *      document.querySelectorAll('input').forEach(el => {
 *        console.log(el.name, el.value);
 *      });
 *    - Copy the input names and note the form ID from the URL
 * 
 * 3. Replace in script.js:
 *    - Replace 'YOUR_FORM_ID' with form ID from sharing URL
 *    - Replace 'YOUR_EMAIL_FIELD_ID' with email field name
 *    - Replace 'YOUR_TOPICS_FIELD_ID' with topics field name
 * 
 * Example URL pattern:
 * https://docs.google.com/forms/d/e/{FORM_ID}/formResponse
 * 
 * ALTERNATIVE: Use Google Apps Script
 * For better control, create a Google Apps Script:
 * 
 * 1. Create new Apps Script project
 * 2. Replace default content with:
 * 
 *    function doPost(e) {
 *      const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getSheetByName('Subscribers');
 *      const email = e.parameter.email;
 *      const topics = e.parameter.topics;
 *      sheet.appendRow([new Date(), email, topics]);
 *      return ContentService.createTextOutput('Success');
 *    }
 * 
 * 3. Deploy as web app (Execute as: your account, Who has access: Anyone)
 * 4. Copy deployment URL and update the fetch URL in script.js
 */

/* ============================================================================
   THEME SWITCHING
   ============================================================================ */

const themeButtons = document.querySelectorAll('.theme-btn');
const savedTheme = localStorage.getItem('theme');

// Apply saved theme on load
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    setActiveTheme(savedTheme);
}

// Button click handling
themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        setActiveTheme(theme);
    });
});

function setActiveTheme(theme) {
    themeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}
/* ============================
   FORMAT TOGGLE — ANIMATE PAGE
   ============================ */

const minimalBtn = document.querySelector('.format-toggle-animated');

// Handle explicit click
if (minimalBtn) {
  minimalBtn.addEventListener('click', () => {
    localStorage.setItem('preferredFormat', 'minimal');
  });
}

// OPTIONAL auto-redirect ONLY on first visit
if (
  localStorage.getItem('preferredFormat') === 'minimal' &&
  !sessionStorage.getItem('redirectedThisSession')
) {
  sessionStorage.setItem('redirectedThisSession', 'true');
  window.location.href = '../../index.html';
}
