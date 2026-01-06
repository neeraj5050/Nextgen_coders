import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import AuthPage from './pages/Authpage';  // Make sure this path matches your folder

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Loading...</p>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {user ? (
          <>
            <p>Welcome back!</p>
            <p>Signed in as: <strong>{user.email}</strong></p>
            <button
              onClick={handleLogout}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>

            <div style={{ marginTop: '50px', width: '100%', maxWidth: '420px' }}>
              <AuthPage />
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;