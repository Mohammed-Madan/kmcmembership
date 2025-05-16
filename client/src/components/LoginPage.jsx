import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get login credentials from environment variables or use defaults
  const validUsername = import.meta.env.VITE_LOGIN_USERNAME || 'admin';
  const validPassword = import.meta.env.VITE_LOGIN_PASSWORD || 'kmc2023';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setError('');
    
    // Basic validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you would make an API call here to authenticate
      // For this example, we'll simulate a login with environment variable credentials
      
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check credentials (in a real app, this would be done server-side)
      if (username === validUsername && password === validPassword) {
        // Store login state in localStorage for session persistence
        localStorage.setItem('isLoggedIn', 'true');
        
        // Call the onLogin function passed from parent component
        onLogin();
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>KMC Membership</h1>
          <p>Login to manage members</p>
        </div>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            style={{ opacity: isLoading ? 0.7 : 1 }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};


export default LoginPage;