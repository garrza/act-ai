function addAutomateButton() {
  const emailViews = document.querySelectorAll(".bHJ");
  emailViews.forEach((emailView) => {
    if (!emailView.querySelector(".act-ai-button")) {
      const button = document.createElement("button");
      button.textContent = "Automate with Act-AI";
      button.className = "act-ai-button";
      button.style.color = "#d32f2f";
      button.style.borderRadius = "4px";
      button.style.border = "1px solid #d32f2f";
      button.style.padding = "4px 8px";
      button.style.marginLeft = "4px";
      button.style.cursor = "pointer";
      button.style.backgroundColor = "transparent";
      button.addEventListener("click", handleAutomateClick);
      emailView.appendChild(button);
    }
  });
}

function handleAutomateClick(event) {
  const emailContainer = document.querySelector(".adn.ads");
  if (!emailContainer) {
    console.error("Email container not found");
    return;
  }
  const emailText = emailContainer.innerText;
  
  chrome.runtime.sendMessage({ action: "authenticate" }, (response) => {
    if (response.success) {
      chrome.storage.local.get(["user"], function (result) {
        if (result.user && result.user.user_id) {
          console.log("Sending task for user:", result.user);
          sendTaskToBackend(emailText, response.token, result.user.user_id);
        } else {
          console.log("User data not found. Fetching user info...");
          fetchUserInfo(response.token, emailText);
        }
      });
    } else {
      console.error("Authentication failed:", response.error);
    }
  });
}

function fetchUserInfo(token, emailText) {
  fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.json())
    .then((data) => {
      const user = {
        email: data.email,
        name: data.name,
        user_id: data.sub
      };
      chrome.storage.local.set({ user: user }, function() {
        console.log("User info updated:", user);
        sendTaskToBackend(emailText, token, user.user_id);
      });
    })
    .catch((error) => console.error("Error fetching user info:", error));
}

function sendTaskToBackend(emailText, token, userId) {
  // Replace with your actual backend API URL
  const apiUrl = "http://127.0.0.1:5000/api/process_task";

  console.log("Sending task to backend:", { emailText, userId });

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email_text: emailText, user_id: userId }),
  })
    .then(async (response) => {
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${responseText}`
        );
      }

      return JSON.parse(responseText);
    })
    .then((data) => {
      console.log("Task processed:", data);
      // Handle the response from your backend
    })
    .catch((error) => {
      console.error("Error processing task:", error);
    });
}

// Run the function when the page loads and whenever it changes
addAutomateButton();
const observer = new MutationObserver(addAutomateButton);
observer.observe(document.body, { childList: true, subtree: true });
