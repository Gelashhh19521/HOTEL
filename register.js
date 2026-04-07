function registerUser() {
  console.log("registerUser called");

  const name = document.getElementById("name").value.trim();
  const emailInput = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  console.log("name:", name);
  console.log("email:", emailInput);
  console.log("password:", password);

  if (!name || !emailInput || !password) {
    alert("Please fill all fields ❌");
    return;
  }

  if (!emailInput.includes("@") || !emailInput.includes(".")) {
    alert("Please enter a valid email ❌");
    return;
  }

  const emailParts = emailInput.split("@");
  const uniqueEmail = emailParts[0] + Date.now() + "@" + emailParts[1];

  console.log("Sending email:", uniqueEmail);

  fetch("https://rentcar.stepprojects.ge/api/Users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      firstName: name,
      lastName: "User",
      phoneNumber: "555123456",
      email: uniqueEmail,
      password: password
    })
  })
    .then(res => {
      return res.text().then(text => {
        console.log("SERVER STATUS:", res.status);
        console.log("SERVER RESPONSE:", text);

        if (!res.ok) {
          throw new Error(text);
        }

        return text;
      });
    })
    .then(data => {
      console.log("SUCCESS:", data);
      alert("Registered successfully ✅");
      window.location.href = "login.html";
    })
    .catch(err => {
      console.log("ERROR:", err.message);
      alert(err.message || "Registration failed ❌");
    });
}