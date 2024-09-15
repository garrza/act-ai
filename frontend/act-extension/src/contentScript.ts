console.log('Content script loaded');

// Gmail URL pattern for viewing an individual email
const emailViewPattern = /#inbox\/[A-Za-z0-9]+/;

const checkEmailView = () => {
  console.log('Checking URL:', window.location.href);  // Debugging URL check

  if (emailViewPattern.test(window.location.href)) {
    console.log('Email is open, updating chrome.storage...');
    chrome.storage.local.set({ isEmailOpen: true }, () => {
      console.log('Stored email open state: true');
      
      // Find the email body
      const emailBody = document.querySelector('.hj');  // Use the correct Gmail class here
      if (emailBody) {
        
        // Check if the custom HTML has already been injected by looking for a specific ID or class
        if (!document.querySelector('#injectedCustomContent')) {
          const customHTML = `
            <div id="injectedCustomContent" style="background-color: #f0f0f0; padding: 10px; border-radius: 8px;">
              <p style="color: red;">This is injected content inside the email!</p>
            </div>
          `;
        
          // Inject custom HTML at the end of the email body
          const tempElement = document.createElement('div');
          tempElement.innerHTML = customHTML;
        
          // Append all child nodes of tempElement to emailBody
          while (tempElement.firstChild) {
            emailBody.appendChild(tempElement.firstChild);
          }
        
          console.log('HTML injected successfully.');
        } else {
          console.log('HTML already injected, skipping injection.');
        }
      }
    });
  } else {
    console.log('Email is not open, updating chrome.storage...');
    chrome.storage.local.set({ isEmailOpen: false }, () => {
      console.log('Stored email open state: false');
    });
  }
};

// Function to detect changes in the Gmail URL (use history API changes)
const detectUrlChange = () => {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  // Override pushState to detect URL changes
  history.pushState = function (...args: [any, string, (string | URL | null)?]) {
    originalPushState.apply(history, args); // Convert arguments to array
    checkEmailView();
  };

  // Override replaceState to detect URL changes
  history.replaceState = function (...args: [any, string, (string | URL | null)?]) {
    originalReplaceState.apply(history, args); // Convert arguments to array
    checkEmailView();
  };

  window.addEventListener('popstate', () => {
    checkEmailView(); // Also check on back/forward navigation
  });
};

// Initial check when the content script is loaded
checkEmailView();
detectUrlChange();

// Use MutationObserver to detect Gmail's AJAX-based DOM changes
const observer = new MutationObserver(() => {
  console.log('MutationObserver triggered');
  checkEmailView();
});

observer.observe(document, {
  childList: true,
  subtree: true,
});
