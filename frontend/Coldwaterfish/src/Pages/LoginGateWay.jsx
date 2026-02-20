

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memberApi } from '../api/api'; 
import '../App.css'; 
import masuImage from '../assets/masu.jpg'; 


const LoginGateWay = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  // [작동 순서 1] 사용자가 아이디/비밀번호를 입력하면 실시간으로 데이터를 수집합니다.
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  /**
   * [작동 순서 2] 로그인 버튼 클릭 시 실행되는 핵심 로직입니다.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 서버에 로그인 요청을 보냅니다. [cite: 2026-01-13]
      const message = await memberApi.login(loginData.username, loginData.password);
      
      // [수정 포인트] "성공" 문구가 포함되면 메인 메뉴로 보냅니다.
      if (message.includes("성공")) {
        // [작동 순서 3] 브라우저에 신분증(user)을 발급합니다. 
        localStorage.setItem('user', loginData.username);
        
        // [작동 순서 4] "/" 대신 확실한 목적지인 "/menu"로 이동합니다.
        // navigate를 써야 페이지가 부드럽게 전환됩니다.
        navigate('/menu'); 
      } else {
        alert(message); // "아이디가 틀렸습니다" 등의 메시지 출력
      }
    } catch (error) {
      alert("서버와 연결할 수 없습니다. 백엔드 상태를 확인하세요!"); 
    }
  };

  return (
    <div className="landing-container">
      
      {/* [왼쪽 영역] 소개글 + 이미지 */}
      <div className="landing-hero">
        <h1>차가운 물속의<br/>신비한 친구들</h1>
        <p>
          대한민국 계곡과 강에 서식하는 냉수어종을<br/>
          <strong>AI로 쉽고 빠르게</strong> 찾아보세요.
        </p>

        <div style={{ margin: '30px 0', textAlign: 'center' }}>
            <img 
              src={masuImage} 
              alt="산천어 사진" 
              style={{ 
                width: '100%', 
                maxWidth: '400px', 
                borderRadius: '15px', 
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)' 
              }} 
            />
        </div>
        
        <ul className="feature-list">
          <li> <strong>이친구의 이름이 뭔지 아시나요?</strong> 산천어에요 </li>
          <li> <strong>가족이 되는 건 어때요?</strong> 냉수어 탐험을 지금 시작해 보세요!</li>
        </ul>
      </div>

      {/* [오른쪽 영역] 로그인 카드 */}
      <div className="login-card">
        <h2 style={{color: '#006064', marginBottom: '20px'}}>로그인</h2>
        <form onSubmit={handleLogin}>
          <input 
            className="form-input" 
            name="username" 
            placeholder="아이디" 
            onChange={handleChange} 
            required
          />
          <input 
            className="form-input" 
            type="password" 
            name="password" 
            placeholder="비밀번호" 
            onChange={handleChange} 
            required
          />
          <button type="submit" className="btn-primary">탐험 시작하기</button>
        </form>
        
        <div style={{marginTop: '20px', fontSize: '0.9rem'}}>
         
          <button onClick={() => navigate('/SignupPage')} className="btn-link">
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

export default LoginGateWay;