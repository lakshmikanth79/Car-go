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

 if (window.location.search.includes('popup=true') && contactPopup) {
        setTimeout(() => contactPopup.classList.add('show'), 300);
    }

    // ✅ Open login popup
    if (loginBtn && loginPopup) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginPopup.classList.add('active-popup');
        });
    }

    // ✅ Close login popup
    if (closeIcon && loginPopup) {
        closeIcon.addEventListener('click', () => {
            loginPopup.classList.remove('active-popup');
            loginPopup.classList.remove('active');

        });
    }

    // ✅ Switch between login/register
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

    // Simple validation
    for (const key in formData) {
      if (!formData[key]) {
        alert("⚠️ Please fill in all fields.");
        return;
      }
    }

    // Optional: Send to backend (replace with your actual API endpoint)
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Registered successfully!");
        registerForm.reset();
        document.querySelector(".cover_box").classList.remove("active");
      } else {
        alert("❌ " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Server error. Please try again later.");
    }
  });
}


    // ✅ OPEN CONTACT POPUP
    if (contactBtn && contactPopup) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactPopup.classList.add('show');
        });
    }

    // ✅ CLOSE CONTACT POPUP (via X icon)
    if (closeContactBtn && contactPopup) {
        closeContactBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            contactPopup.classList.remove('show');
        });
    }

    // ✅ CLOSE WHEN CLICKING OUTSIDE POPUP BOX
    if (contactPopup) {
        contactPopup.addEventListener('click', (e) => {
            if (e.target === contactPopup) {
                contactPopup.classList.remove('show');
            }
        });
    }
     

    // ✅ Handle Login Form Submission (Frontend Only)
const loginForm = document.querySelector(".form-box.login form");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = loginForm.querySelector('input[name="email"]').value.trim();
    const password = loginForm.querySelector('input[name="password"]').value.trim();

    // 🔹 Basic validation
    if (!email || !password) {
      alert("⚠️ Please enter both email and password.");
      return;
    }

    // 🔹 Mock validation (temporary frontend check)
    const validEmail = "user@example.com";
    const validPassword = "12345";

    if (email === validEmail && password === validPassword) {
      alert("✅ Login successful!");
      window.location.href = "home.html"; // simulate redirect
    } else {
      alert("❌ Invalid email or password. Try user@example.com / 12345");
    }
  });
}


    



    // ✅ CONTACT FORM SUBMISSION + STORE LOCALLY
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const message = contactForm.querySelector('#message').value.trim();
            const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            if (!emailPattern.test(email)) {
                alert('Please enter a valid email.');
                return;
            }

            // ✅ Save message to localStorage
            const existingMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
            existingMessages.push({
                name,
                email,
                message,
                timestamp: new Date().toLocaleString(),
            });
            localStorage.setItem('contactMessages', JSON.stringify(existingMessages));

            alert('✅ Message sent successfully!');

            // ✅ Reset and close popup
            contactForm.reset();
            setTimeout(() => {
            contactPopup.classList.remove('show');
             }, 100);
        });
    }
});
