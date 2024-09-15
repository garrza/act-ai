console.log('Content script loaded');

const EMAIL_VIEW_PATTERN = /#inbox\/[A-Za-z0-9]+/;
const INJECTED_CONTENT_ID = 'injectedCustomContent';

const checkEmailView = () => {
  const isEmailOpen = EMAIL_VIEW_PATTERN.test(window.location.href);
  chrome.storage.local.set({ isEmailOpen });

  if (isEmailOpen) {
    injectCustomContent();
  } else {
    removeCustomContent();
  }
};

const injectCustomContent = () => {
  if (document.getElementById(INJECTED_CONTENT_ID)) return;

  const emailBody = document.querySelector('.hj');
  if (emailBody) {
    const customHTML = `
      <div id="${INJECTED_CONTENT_ID}" style="background-color: #f0f0f0; padding: 10px; border-radius: 8px;">
        <p style="color: red;">This is injected content inside the email!</p>
      </div>
    `;
    emailBody.insertAdjacentHTML('beforeend', customHTML);
  }
};

const removeCustomContent = () => {
  const injectedContent = document.getElementById(INJECTED_CONTENT_ID);
  if (injectedContent) {
    injectedContent.remove();
  }
};

const detectUrlChange = () => {
  const { pushState, replaceState } = history;

  history.pushState = function(...args) {
    pushState.apply(this, args);
    checkEmailView();
  };

  history.replaceState = function(...args) {
    replaceState.apply(this, args);
    checkEmailView();
  };

  window.addEventListener('popstate', checkEmailView);
};

const observeDOMChanges = () => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        checkEmailView();
        break;
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
};

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "getEmailContent") {
    const emailBody = document.querySelector('.a3s.aiL');
    sendResponse({ emailContent: emailBody ? emailBody.textContent : null });
  }
  return true;
});

// Initialize
checkEmailView();
detectUrlChange();
observeDOMChanges();
