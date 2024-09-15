// Gmail URL pattern for viewing an individual email
console.log('Content script loaded');
const emailViewPattern = /https:\/\/mail\.google\.com\/mail\/u\/\d\/#inbox\/\w+/;

const checkEmailView = () => {
  if (emailViewPattern.test(window.location.href)) {
    console.log('Email is open');
    try {
      chrome.runtime.sendMessage({ action: 'email_opened' });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
};

// Check when the content script is loaded
checkEmailView();

// Use MutationObserver to detect Gmail's AJAX-based navigation changes
const observer = new MutationObserver(() => {
  checkEmailView();
});

observer.observe(document, {
  childList: true,
  subtree: true,
});
