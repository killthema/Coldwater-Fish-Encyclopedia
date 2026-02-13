import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memberApi } from '../api/api';
import '../App.css'; 
import masuImage from '../assets/masu.jpg';


const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const message = await memberApi.login(loginData.username, loginData.password);
      if (message.includes("성공")) {
        localStorage.setItem('user', loginData.username);
        window.location.href = "/";
      } else {
        alert(message);
      }
    } catch (error) {
      alert("서버 연결 실패!");
    }
  };

  return (
    <div className="landing-container">
      
      {/* [왼쪽] 소개글 + 이미지 */}
      <div className="landing-hero">
        <h1>차가운 물속의<br/>신비한 친구들</h1>
        <p>
          대한민국 계곡과 강에 서식하는 냉수어종을<br/>
          <strong>AI로 쉽고 빠르게</strong> 찾아보세요.
        </p>

        {/* 산천어 */}
        <div style={{ margin: '30px 0', textAlign: 'center' }}>
            <img 
              src={masuImage} 
              alt="산천어 사진" 
              style={{ 
                width: '100%', 
                maxWidth: '400px', // 너무 커지지 않게 제한
                borderRadius: '15px', // 모서리 둥글게
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)' // 그림자 효과
              }} 
            />
        </div>
        
        <ul className="feature-list">
          <li> <strong>이친구의 이름이 뭔지 아시나요?</strong> 산천어에요</li>
          <li> <strong>네 강원도에서 유명한 그 친구 맞습니다.</strong> 냉수어에 대해 더 알아보고 싶지않아요? 귀여운 연어 친구들과 함께 가족이 되는건 어때요?</li>
        </ul>
      </div>

      {/* [오른쪽] 로그인 카드 (그대로 유지) */}
      <div className="login-card">
        <h2 style={{color: '#006064', marginBottom: '20px'}}>로그인</h2>
        <form onSubmit={handleLogin}>
          <input 
            className="form-input" 
            name="username" 
            placeholder="아이디" 
            onChange={handleChange} 
          />
          <input 
            className="form-input" 
            type="password" 
            name="password" 
            placeholder="비밀번호" 
            onChange={handleChange} 
          />
          <button type="submit" className="btn-primary">탐험 시작하기</button>
        </form>
        <div style={{marginTop: '20px', fontSize: '0.9rem'}}>
          <button onClick={() => navigate('/signup')} className="btn-link">
            처음 오셨나요? <strong>회원가입</strong>
          </button>
          <br/>
          <button onClick={() => navigate('/find')} className="btn-link" style={{color: '#999'}}>
            계정을 잊으셨나요?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;