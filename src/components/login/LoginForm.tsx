import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from "react-router-dom";
import './Login.css'; 

// interface LoginFormProps {
//   onSwitchToRegister: () => void;
//   onLoginSuccess: (userData: any) => void;
// }

const LoginForm: React.FC = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log(storedUser,"user");
    
    if (storedUser) {
      navigate("/todo");
      return;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/auth/login', { email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Login successful', response.data);
      // onLoginSuccess(response.data);
      const userData = {
        token: response.data.token,
        userId: response.data.userId
      }
      localStorage.setItem('user',JSON.stringify(userData));
      navigate("/todo");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Login failed. Please check your credentials.');
      } else {
        setError('An unexpected error occurred.');
      }
      console.error('Login error', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="register-prompt">
          Don't have an account?{' '}
          <button onClick={() => navigate("/register")} className="register-link">Register</button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;