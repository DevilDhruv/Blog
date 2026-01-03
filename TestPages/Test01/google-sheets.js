const form = document.getElementById("subscribeForm");
const message = document.getElementById("formMessage");

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzedS6lUu1IYbWfDM4NRPElI10_mQk7l-jDKNcsvhTOieAq96qR-AP8v-O6VO8hJJsxeg/exec";
// ---------------------------
// Already subscribed UX
// ---------------------------
if (localStorage.getItem("subscribed") === "true") {
  form.innerHTML = `
    <p class="form-message success">
      You're already subscribed ✨ <br />
      I’ll only email when it’s worth your time.
    </p>
  `;
}

// ---------------------------
// Submit handler
// ---------------------------
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  message.textContent = "Subscribing…";
  message.className = "form-message";

  const emailInput = form.querySelector(".email-input");
  const submitBtn = form.querySelector(".submit-button");

  const email = emailInput.value.trim();

  const topics = Array.from(
    form.querySelectorAll("input[name='topics']:checked")
  ).map((cb) => cb.value);

  // ---------------------------
  // Honeypot anti-bot field
  // ---------------------------
  const honeypot = form.querySelector("input[name='company']");
  if (honeypot && honeypot.value) {
    // Silently succeed for bots
    return;
  }

  // ---------------------------
  // Basic validation
  // ---------------------------
  if (!email || !email.includes("@")) {
    message.textContent = "Please enter a valid email address.";
    message.classList.add("error");
    return;
  }

  // Prevent double submit
  submitBtn.disabled = true;

  const payload = new URLSearchParams({
    email,
    topics: topics.join(", "), // Join array into comma-separated string
    source: location.pathname,
    company: honeypot ? honeypot.value : "", // Pass the VALUE, not the element
  });

  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(), // Don't wrap in another URLSearchParams
      redirect: "follow", // Important for Google Scripts
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || "Subscription failed");
    }

    // ---------------------------
    // Success UX
    // ---------------------------
    message.textContent = "Subscribed successfully ⚡ See you soon!";
    message.classList.add("success");

    localStorage.setItem("subscribed", "true");

    form.reset();
    submitBtn.disabled = true;
    setTimeout(() => {
      form.innerHTML = `
    <p class="form-message success">
      You’re already subscribed ✨ <br />
      I’ll only email when it’s worth your time.
    </p>`;
      clearTimeout();
    }, 2000);
  } catch (err) {
    console.error(err);

    message.textContent = "Something went wrong. Please try again later.";
    message.classList.add("error");

    submitBtn.disabled = false;
  }
});
