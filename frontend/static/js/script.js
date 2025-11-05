document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");
});

document.addEventListener("DOMContentLoaded", function () {
  // --- LOGIN POPUP ELEMENTS ---
  const loginBtn = document.querySelector(".btnLogin-popup");
  const loginPopup = document.querySelector(".login-popup");

  const closeIcon = document.querySelector(".icon-close");
  const registerLink = document.querySelector(".register-link");
  const loginLink = document.querySelector(".login-link");

  // --- CONTACT POPUP ELEMENTS ---
  const contactBtn = document.querySelector("#contactBtn");
  const contactPopup = document.querySelector(".contact-popup");
  const closeContactBtn = document.querySelector("#closeContact");
  const contactForm = document.querySelector("#contactForm");

  if (window.location.search.includes("popup=true") && contactPopup) {
    setTimeout(() => contactPopup.classList.add("show"), 300);
  }

  // ✅ Open login popup
  if (loginBtn && loginPopup) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      loginPopup.classList.add("active-popup");
    });
  }

  // ✅ Close login popup
  if (closeIcon && loginPopup) {
    closeIcon.addEventListener("click", () => {
      loginPopup.classList.remove("active-popup");
      loginPopup.classList.remove("active");
    });
  }

  // ✅ Switch between login/register
  if (registerLink) {
    registerLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginPopup.classList.add("active");
    });
  }

  if (loginLink) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginPopup.classList.remove("active");
    });
  }

  // ✅ Handle Register Form Submission
  const registerForm = document.querySelector("#registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        cust_name: registerForm.cust_name.value.trim(),
        cust_phone: registerForm.cust_phone.value.trim(),
        cust_address: registerForm.cust_address.value.trim(),
        driving_license_no: registerForm.driving_license_no.value.trim(),
        cust_email: registerForm.cust_email.value.trim(),
        password: registerForm.password.value.trim(),
      };

      for (const key in formData) {
        if (!formData[key]) {
          alert("⚠️ Please fill in all fields.");
          return;
        }
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok && result.success) {
          alert("✅ Registered successfully!");
          registerForm.reset();
          document.querySelector(".login-popup").classList.remove("active");
        } else {
          alert("❌ " + (result.message || "Registration failed"));
        }
      } catch (err) {
        console.error(err);
        alert("⚠️ Server error. Please try again later.");
      }
    });
  }

  // ✅ OPEN CONTACT POPUP
  if (contactBtn && contactPopup) {
    contactBtn.addEventListener("click", (e) => {
      e.preventDefault();
      contactPopup.classList.add("show");
    });
  }

  // ✅ CLOSE CONTACT POPUP (via X icon)
  if (closeContactBtn && contactPopup) {
    closeContactBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      contactPopup.classList.remove("show");
    });
  }

  // ✅ CLOSE WHEN CLICKING OUTSIDE POPUP BOX
  if (contactPopup) {
    contactPopup.addEventListener("click", (e) => {
      if (e.target === contactPopup) {
        contactPopup.classList.remove("show");
      }
    });
  }

  // ✅ Handle Login Form Submission (real backend)
  const loginForm = document.querySelector(".form-box.login form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = loginForm.querySelector('input[name="email"]').value.trim();
      const password = loginForm.querySelector('input[name="password"]').value.trim();

      if (!email || !password) {
        alert("⚠️ Please enter both email and password.");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cust_email: email, password }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          alert("✅ Login successful!");
          localStorage.setItem("cust_id", result.cust_id);
          localStorage.setItem("cust_name", result.cust_name);
          window.location.href = "home.html";
        } else {
          alert("❌ " + (result.message || "Invalid email or password."));
        }
      } catch (error) {
        console.error(error);
        alert("⚠️ Server error. Please try again later.");
      }
    });
  }

  // ✅ CONTACT FORM SUBMISSION 
   if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = contactForm.querySelector("#name").value.trim();
    const email = contactForm.querySelector("#email").value.trim();
    const message = contactForm.querySelector("#message").value.trim();
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if (!name || !email || !message) {
      alert("⚠️ Please fill in all fields.");
      return;
    }

    if (!emailPattern.test(email)) {
      alert("⚠️ Please enter a valid email.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Message sent successfully!");
        contactForm.reset();
        setTimeout(() => contactPopup.classList.remove("show"), 100);
      } else {
        alert("❌ " + (data.message || "Failed to send message"));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("⚠️ Server error. Please try again later.");
    }
  });
}

});
