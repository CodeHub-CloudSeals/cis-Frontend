// src/auth.js
export async function loginUser(username, password) {
  const response = await fetch("http://34.45.198.251:9091/cloudseal/v1/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) throw new Error("Login failed");

  const data = await response.json();

  // Store token if needed
  const token = data.token || data.jwt; // Adjust based on actual key
  localStorage.setItem("authToken", token);

  return token;
}
