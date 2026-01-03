const form = document.getElementById("subscribe-form");
const message = document.getElementById("form-message");

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyEZdg5uC9O7hSD7JCwdSeXuw5Ayq5joUJBqc2d_TQIC4VpX0soVUCSDAek6fIzu51LOw/exec"
// ------------------------------------
// Already subscribed UX
// ------------------------------------
if (localStorage.getItem("subscribed") === "true") {
  form.innerHTML = `
    <p class="form-message success">
      You’re already subscribed ✨ <br />
      I’ll only email when it’s worth your time.
    </p>
  `;
}

// ------------------------------------
// Submit handler
// ------------------------------------
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  message.textContent = "Subscribing…";
  message.className = "form-message";

  const emailInput = document.getElementById("email");
  const submitBtn = form.querySelector(".submit-button");

  const email = emailInput.value.trim();

  const topics = Array.from(
    form.querySelectorAll("input[name='topics']:checked")
  ).map(cb => cb.value);

  // ------------------------------------
  // Honeypot (anti-bot)
  // ------------------------------------
  const honeypot = form.querySelector("input[name='company']");
  if (honeypot && honeypot.value) {
    // Silent success for bots
    return;
  }

  // ------------------------------------
  // Validation
  // ------------------------------------
  if (!email || !email.includes("@")) {
    message.textContent = "Please enter a valid email address.";
    message.classList.add("error");
    return;
  }

  submitBtn.disabled = true;

  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        email,
        topics,
        source: "index.html",
        timestamp: new Date().toISOString()
      })
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || "Subscription failed");
    }

    // ------------------------------------
    // Success UX
    // ------------------------------------
    message.textContent = "Subscribed ⚡ See you in the next drop!";
    message.classList.add("success");

    localStorage.setItem("subscribed", "true");

    form.reset();
    submitBtn.disabled = true;

  } catch (err) {
    console.error(err);

    message.textContent =
      "Something went wrong. Please try again later.";
    message.classList.add("error");

    submitBtn.disabled = false;
  }
});
