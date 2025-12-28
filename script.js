// ==========================================
// Scroll-based Fade-in Animations
// ==========================================

/**
 * Observes elements and adds 'visible' class when they enter viewport
 * This triggers CSS animations defined in style.css
 */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        // Optionally unobserve after animation to improve performance
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Select all sections to animate
  const sections = document.querySelectorAll(".categories, .latest-posts, .subscribe")
  sections.forEach((section) => {
    observer.observe(section)
  })
}

// ==========================================
// Subscribe Form Handling
// ==========================================

/**
 * Handles form submission to Google Sheets
 * Replace GOOGLE_SCRIPT_URL with your actual Google Apps Script endpoint
 */
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"

function initSubscribeForm() {
  const form = document.getElementById("subscribe-form")
  const messageEl = document.getElementById("form-message")

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const submitButton = form.querySelector(".submit-button")
    const email = form.querySelector("#email").value
    const checkedTopics = Array.from(form.querySelectorAll('input[name="topics"]:checked')).map(
      (checkbox) => checkbox.value,
    )

    // Validate at least one topic is selected
    if (checkedTopics.length === 0) {
      showMessage("Please select at least one topic", "error")
      return
    }

    // Disable button and show loading state
    submitButton.disabled = true
    submitButton.textContent = "Subscribing..."
    messageEl.textContent = ""
    messageEl.className = "form-message"

    // Prepare data for submission
    const formData = {
      email: email,
      topics: checkedTopics.join(", "),
      timestamp: new Date().toISOString(),
    }

    try {
      // Submit to Google Apps Script endpoint
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Required for Google Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      // Note: With 'no-cors', we can't read the response
      // Assume success if no error is thrown
      showMessage("Successfully subscribed! Check your email for confirmation.", "success")
      form.reset()

      console.log("[v0] Form submitted:", formData)
    } catch (error) {
      console.error("[v0] Subscription error:", error)
      showMessage("Something went wrong. Please try again later.", "error")
    } finally {
      // Re-enable button
      submitButton.disabled = false
      submitButton.textContent = "Subscribe"
    }
  })

  function showMessage(text, type) {
    messageEl.textContent = text
    messageEl.className = `form-message ${type}`
  }
}

// ==========================================
// Smooth Scroll for CTA Button
// ==========================================

/**
 * Ensures smooth scrolling works even if CSS is not supported
 */
function initSmoothScroll() {
  const ctaButton = document.querySelector(".cta-button")

  if (ctaButton) {
    ctaButton.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = ctaButton.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  }
}

// ==========================================
// Initialize All Features
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initScrollAnimations()
  initSubscribeForm()
  initSmoothScroll()

  console.log("[v0] Blog homepage initialized")
})

// ==========================================
// Google Apps Script Setup Instructions
// ==========================================

/*
To set up Google Sheets integration:

1. Create a new Google Sheet
2. Go to Extensions > Apps Script
3. Paste the following code:

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Email', 'Topics']);
    }
    
    // Add subscriber data
    sheet.appendRow([
      data.timestamp,
      data.email,
      data.topics
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Subscription recorded'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

4. Deploy as Web App:
   - Click "Deploy" > "New deployment"
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Copy the Web App URL and replace GOOGLE_SCRIPT_URL in script.js

Alternative: Use Google Forms
Create a Google Form with Email and Topics fields, then use the form's action URL
*/

/* ==========================================
   THEME SWITCHING
   ========================================== */

const themeButtons = document.querySelectorAll('.theme-btn');
const savedTheme = localStorage.getItem('theme');

// Apply saved theme on load
if (savedTheme) {
  document.body.setAttribute('data-theme', savedTheme);
  setActiveTheme(savedTheme);
}

// Handle button clicks
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
