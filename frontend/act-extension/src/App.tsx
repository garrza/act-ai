import { useState, useEffect } from 'react'

import Button from '@mui/material/Button'
import Box from '@mui/material/Box';

import LogoAnimation from './LogoAnimation.tsx'
import GoogleIcon from './GoogleIcon.tsx';

import './App.css';

function App() {
  const [isEmailOpen, setIsEmailOpen] = useState(false);


  useEffect(() => {
    alert('Listening for messages...');
    chrome.runtime.onMessage.addListener((message) => {
      alert('Message received:');
      if (message.action === 'email_opened') {
        console.log('Email opened!');
        setIsEmailOpen(true);
      } else {
        setIsEmailOpen(false);
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
  )
}

export default App
