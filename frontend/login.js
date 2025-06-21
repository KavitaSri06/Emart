document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginBtn").addEventListener("click", login);
  });
  
  function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    const data = {
      username: username,
      password: password
    };
  
    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
.then((data) => {
  if (data.message) {
    document.getElementById("error").innerText = data.message;
  } else if (data.role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "shop.html";
  }
})
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("error").innerText = "Something went wrong!";
    });
  }
  
