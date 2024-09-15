import { useState, useEffect, useCallback } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LogoAnimation from './LogoAnimation';
import GoogleIcon from './GoogleIcon';
import ActionButton from './ActionButton';
import './App.css';

// Add this interface to define the shape of your user object
interface User {
  user_id: string;
  name: string;
  email: string;
}

function App() {
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  // Update the user state to use the User interface
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already signed in
    chrome.storage.local.get(['user'], (result) => {
      if (result.user) {
        setUser(result.user as User);
      }
    });

    const fetchEmailState = () => {
      chrome.storage.local.get(['isEmailOpen'], (result) => {
        setIsEmailOpen(result.isEmailOpen || false);
      });
    };

    fetchEmailState();

    const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.isEmailOpen) {
        setIsEmailOpen(changes.isEmailOpen.newValue);
      }
    };

    chrome.storage.onChanged.addListener(listener);

    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  const handleSignIn = useCallback(() => {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/auth';
    const clientId = '643902801093-l9vcatsf4bf9o50akjgsu4tk2sqrjp48.apps.googleusercontent.com'; // Replace with your actual client ID
    const redirectUri = chrome.identity.getRedirectURL();
    const scopes = ['profile', 'email']; // Add or modify scopes as needed

    const authUrl = `${googleAuthUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scopes.join(' '))}`;

    chrome.identity.launchWebAuthFlow(
      { url: authUrl, interactive: true },
      async (responseUrl) => {
        if (chrome.runtime.lastError || !responseUrl) {
          console.error(chrome.runtime.lastError || 'No response URL');
          return;
        }

        // Extract the access token from the response URL
        const accessToken = new URLSearchParams(responseUrl.split('#')[1]).get('access_token');

        if (accessToken) {
          // Send the access token to your backend
          try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/google', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token: accessToken }),
            });
            const data: User = await response.json();
            setUser(data);
            chrome.storage.local.set({ user: data });
          } catch (error) {
            console.error('Error:', error);
          }
        }
      }
    );
  }, []);

  const handleSignOut = useCallback(() => {
    chrome.identity.clearAllCachedAuthTokens(() => {
      setUser(null);
      chrome.storage.local.remove('user');
    });
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh',
      gap: '40px',
    }}>
      <LogoAnimation />
      {user ? (
        <>
          <Box>Welcome, {user.name}!</Box>
          <ActionButton isEmailOpen={isEmailOpen} userId={user.user_id} />
          <Button
            variant="outlined"
            color="error"
            size="large"
            onClick={handleSignOut}
            sx={{
              gap: '16px',
              '&:focus': { outline: 'none', boxShadow: 'none' },
              '&:hover': { borderColor: 'red' },
            }}
          >
            SIGN OUT
          </Button>
        </>
      ) : (
        <Button
          variant="outlined"
          color="error"
          size="large"
          onClick={handleSignIn}
          sx={{
            gap: '16px',
            '&:focus': { outline: 'none', boxShadow: 'none' },
            '&:hover': { borderColor: 'red' },
          }}
        >
          SIGN IN WITH GOOGLE
          <GoogleIcon />
        </Button>
      )}
      <Box sx={{ color: isEmailOpen ? 'green' : 'red' }}>
        {isEmailOpen ? 'Email is open in Gmail!' : 'Email is not open.'}
      </Box>
    </Box>
  );
}

export default App;
