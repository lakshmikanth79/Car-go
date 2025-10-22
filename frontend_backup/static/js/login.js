document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email && password) {
    alert("Login successful (backend pending). Redirecting...");
    window.location.href = "home.html";
  } else {
    alert("Please enter valid credentials.");
  }
});
