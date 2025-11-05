document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (name && email && password) {
    alert("Registration successful (backend pending). Redirecting to login...");
    window.location.href = "login.html";
  } else {
    alert("All fields are required.");
  }
});
