document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('fade-in');
});

document.addEventListener('DOMContentLoaded', function () {
  // --- LOGIN POPUP ELEMENTS ---
  const loginBtn = document.querySelector('.btnLogin-popup');
  const loginPopup = document.querySelector('.login-popup');
  const closeIcon = document.querySelector('.icon-close');
  const registerLink = document.querySelector('.register-link');
  const loginLink = document.querySelector('.login-link');

  // --- CONTACT POPUP ELEMENTS ---
  const contactBtn = document.querySelector('#contactBtn');
  const contactPopup = document.querySelector('.contact-popup');
  const closeContactBtn = document.querySelector('#closeContact');
  const contactForm = document.querySelector('#contactForm');

  // ✅ Auto-show contact popup if ?popup=true in URL
  if (window.location.search.includes('popup=true') && contactPopup) {
    setTimeout(() => contactPopup.classList.add('show'), 300);
  }

  // ✅ OPEN LOGIN POPUP
  if (loginBtn && loginPopup) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginPopup.classList.add('active-popup');
    });
  }

  // ✅ CLOSE LOGIN POPUP
  if (closeIcon && loginPopup) {
    closeIcon.addEventListener('click', () => {
      loginPopup.classList.remove('active-popup');
      loginPopup.classList.remove('active');
    });
  }

  // ✅ SWITCH BETWEEN LOGIN AND REGISTER
  if (registerLink) {
    registerLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginPopup.classList.add('active');
    });
  }

  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginPopup.classList.remove('active');
    });
  }

  // ✅ REGISTER FORM HANDLER (Backend Integrated)
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

      // ✅ Basic Validation
      for (const key in formData) {
        if (!formData[key]) {
          alert("⚠️ Please fill in all fields.");
          return;
        }
      }

      // ✅ Send to backend
      try {
        const res = await fetch("http://127.0.0.1:5000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.success) {
          alert("✅ Registration successful! Please log in.");
          registerForm.reset();
          loginPopup.classList.remove("active"); // switch back to login view
        } else {
          alert("❌ " + (data.message || "Registration failed."));
        }
      } catch (err) {
        console.error("Registration Error:", err);
        alert("⚠️ Server error during registration.");
      }
    });
  }

  // ✅ LOGIN FORM HANDLER (Backend Integrated)
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
        const res = await fetch("http://127.0.0.1:5000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cust_email: email, password }),
        });

        const data = await res.json();

        if (data.success) {
          alert("✅ Login successful!");
          localStorage.setItem("loggedInUser", JSON.stringify(data.user)); // ✅ consistent key
          window.location.href = "home.html";
        } else {
          alert("❌ " + (data.message || "Invalid credentials."));
        }
      } catch (err) {
        console.error("Login Error:", err);
        alert("⚠️ Server error during login.");
      }
    });
  }

  // ✅ CONTACT POPUP OPEN/CLOSE LOGIC
  if (contactBtn && contactPopup) {
    contactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      contactPopup.classList.add('show');
    });
  }

  if (closeContactBtn && contactPopup) {
    closeContactBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      contactPopup.classList.remove('show');
    });
  }

  if (contactPopup) {
    contactPopup.addEventListener('click', (e) => {
      if (e.target === contactPopup) {
        contactPopup.classList.remove('show');
      }
    });
  }

  // ✅ CONTACT FORM SUBMISSION (Backend + LocalStorage)
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const message = contactForm.querySelector('#message').value.trim();
      const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

      if (!name || !email || !message) {
        alert('⚠️ Please fill in all fields.');
        return;
      }

      if (!emailPattern.test(email)) {
        alert('⚠️ Please enter a valid email address.');
        return;
      }

      // ✅ Save locally for history
      const existingMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
      existingMessages.push({
        name,
        email,
        message,
        timestamp: new Date().toLocaleString(),
      });
      localStorage.setItem('contactMessages', JSON.stringify(existingMessages));

      // ✅ Send to backend
      try {
        const res = await fetch("http://127.0.0.1:5000/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });

        const data = await res.json();
        if (data.success) {
          alert("✅ Message sent successfully!");
        } else {
          alert("⚠️ " + (data.message || "Could not send message."));
        }
      } catch (err) {
        console.error("Contact Error:", err);
        alert("⚠️ Server error while sending message.");
      }

      contactForm.reset();
      setTimeout(() => contactPopup.classList.remove('show'), 100);
    });
  }
});
