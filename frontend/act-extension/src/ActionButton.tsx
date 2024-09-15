import { useState } from 'react';
import Button from '@mui/material/Button';

interface ActionButtonProps {
  isEmailOpen: boolean;
  userId: string;
}

function ActionButton({ isEmailOpen, userId }: ActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = () => {
    if (!isEmailOpen) {
      alert('Please open an email first!');
      return;
    }

    setIsLoading(true);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, { action: "getEmailContent" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          setIsLoading(false);
          return;
        }

        // Send the email content to your backend
        fetch('http://127.0.0.1:5000/api/process_task', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_text: response.emailContent,
            user_id: userId,
          }),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Task processed:', data);
          alert('Task processed successfully!');
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while processing the task.');
        })
        .finally(() => {
          setIsLoading(false);
        });
      });
    });
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleAction}
      disabled={isLoading || !isEmailOpen}
    >
      {isLoading ? 'Processing...' : 'Process Email'}
    </Button>
  );
}

export default ActionButton;
