function loginUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showMessage("Please fill all fields ❌", "error");
    return;
  }

  fetch("https://rentcar.stepprojects.ge/api/Users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phoneNumber: "",
      password: password,
      email: email,
      firstName: "",
      lastName: "",
      role: ""
    })
  })
    .then(res => {
      return res.text().then(text => {
        if (!res.ok) {
          throw new Error(text);
        }

        try {
          return JSON.parse(text);
        } catch {
          throw new Error("Login response is not valid JSON");
        }
      });
    })
    .then(data => {
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userFirstName", data.firstName);
      localStorage.setItem("userLastName", data.lastName);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userPhoneNumber", data.phoneNumber);

      showMessage("Login successful ✅", "success");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);
    })
    .catch(err => {
      console.error(err);
      showMessage(err.message || "Login failed ❌", "error");
    });
}

function showMessage(text, type) {
  let oldMessage = document.querySelector(".custom-message");
  if (oldMessage) oldMessage.remove();

  const msg = document.createElement("div");
  msg.className = `custom-message ${type}`;
  msg.textContent = text;

  document.body.appendChild(msg);

  setTimeout(() => {
    msg.classList.add("show");
  }, 10);

  setTimeout(() => {
    msg.classList.remove("show");
    setTimeout(() => msg.remove(), 300);
  }, 2200);
}