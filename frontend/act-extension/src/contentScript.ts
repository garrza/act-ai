console.log('Content script loaded');

// Gmail URL pattern for viewing an individual email
const emailViewPattern = /#inbox\/[A-Za-z0-9]+/;

const checkEmailView = () => {
  console.log('Checking URL:', window.location.href);  // Debugging URL check
  if (emailViewPattern.test(window.location.href)) {
    console.log('Email is open, updating chrome.storage...');
    chrome.storage.local.set({ isEmailOpen: true }, () => {
      console.log('Stored email open state: true');
    });
  } else {
    console.log('Email is not open, updating chrome.storage...');
    chrome.storage.local.set({ isEmailOpen: false }, () => {
      console.log('Stored email open state: false');
    });
  }
};

// Initial check when the content script is loaded
checkEmailView();

// Use MutationObserver to detect Gmail's AJAX-based navigation changes
const observer = new MutationObserver(() => {
  console.log('MutationObserver triggered');
  checkEmailView();
});

observer.observe(document, {
  childList: true,
  subtree: true,
});
