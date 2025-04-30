import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from '../../assets/logo.png';
import { loginAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  // Hardcode email và password
  const [account, setAccount] = useState('admin1@gmail.com');
  const [password, setPassword] = useState('123456789');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const result = await loginAPI(account, password);
      login(result.token, result.user);      // Lưu login vào context
      navigate('/home');                     // Chuyển trang nếu thành công
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="login-wrapper">


      <main className="login-main">
        <h2>Dịch vụ xác thực tập trung</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Account</label>
          <input type="text" value={account} onChange={(e) => setAccount(e.target.value)} required />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <div className="login-options">
            <a href="#">Forgot password?</a>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit">Login</button>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
