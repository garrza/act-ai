import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LogoAnimation from './LogoAnimation.tsx';
import GoogleIcon from './GoogleIcon.tsx';
import './App.css';

function App() {
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  // Fetch email open state from chrome.storage when the popup opens
  useEffect(() => {
    console.log('Popup opened, fetching email open state from storage...');
    
    chrome.storage.local.get(['isEmailOpen'], (result) => {
      console.log('Stored email open state:', result.isEmailOpen);
      setIsEmailOpen(result.isEmailOpen || false);  // Default to false if no state is found
    });

    // Optionally, listen for changes in storage to auto-update the UI
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.isEmailOpen) {
        console.log('Email open state changed:', changes.isEmailOpen.newValue);
        setIsEmailOpen(changes.isEmailOpen.newValue);
      }
    });
  }, []);

  const handleClick = () => {
    chrome.tabs.create({ url: 'https://www.google.com' });
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        flexDirection: 'column',
        gap: '40px',
      }}>
        <LogoAnimation />
        <Box textAlign={"center"} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Button
            variant="outlined"
            color="error"
            size='large'
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&:hover': {
                borderColor: 'red',
              },
            }}
            onClick={handleClick}>
            SIGN IN WITH GOOGLE
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'}}>
              <GoogleIcon />
            </Box>
          </Button>
          {isEmailOpen ? (
            <p style={{ color: 'green' }}>Email is open in Gmail!</p>
          ) : (
            <p style={{ color: 'red' }}>Email is not open.</p>
          )}
        </Box>
      </Box>
    </>
  );
}

export default App;
