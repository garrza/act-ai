document.addEventListener("DOMContentLoaded", function () {
  const signInButton = document.getElementById("sign-in");
  const userInfo = document.getElementById("user-info");

  function updateUserInfo(user) {
    if (user) {
      userInfo.innerHTML = `
          <p>Signed in as: ${user.email}</p>
          <p>Name: ${user.name}</p>
        `;
      signInButton.textContent = "Sign Out";
    } else {
      userInfo.innerHTML = "<p>Not signed in</p>";
      signInButton.textContent = "Sign In";
    }
  }

  function handleAuthClick() {
    chrome.runtime.sendMessage({ action: "authenticate" }, (response) => {
      if (response.success) {
        fetchUserInfo(response.token);
      } else {
        console.error("Authentication failed:", response.error);
      }
    });
  }

  function fetchUserInfo(token) {
    fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const user = {
          email: data.email,
          name: data.name,
          user_id: data.sub // Google's unique identifier for the user
        };
        updateUserInfo(user);
        chrome.storage.local.set({ user: user });
      })
      .catch((error) => console.error("Error fetching user info:", error));
  }

  signInButton.addEventListener("click", handleAuthClick);

  chrome.storage.local.get(["user"], function (result) {
    if (result.user) {
      updateUserInfo(result.user);
    }
  });
});
