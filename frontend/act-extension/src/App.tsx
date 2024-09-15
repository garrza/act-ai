import Button from '@mui/material/Button'
import Box from '@mui/material/Box';

import LogoAnimation from './LogoAnimation.tsx'
import GoogleIcon from './GoogleIcon.tsx';

import './App.css';

function App() {
  const handleClick = () => {
    alert('Redirecting to Google...')
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
        </Box>
      </Box>
    </>
  )
}

export default App
