import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memberApi } from '../api/api';
import '../App.css';

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '', 
    password: '',
    nickname: '', 
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.nickname) {
      alert("아이디, 비밀번호, 닉네임은 필수입니다!");
      return;
    }

    try {
      const message = await memberApi.signup(formData);
      alert(message); 
      navigate('/login'); 

    } catch (error) {
      console.error("가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    // 로그인 페이지와 똑같은 'login-card' 디자인 적용
    <div className="login-card">
      <div className="login-header">
        <h1></h1> {/*  (메모장 느낌) */}
        <h2>회원가입</h2>
      </div>

      <form onSubmit={handleSubmit}>
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
        <input 
          className="form-input" 
          name="nickname" 
          placeholder="닉네임 (별명)" 
          onChange={handleChange} 
        />
        <input 
          className="form-input" 
          name="email" 
          type="email" 
          placeholder="이메일 (ID 찾기용)" 
          onChange={handleChange} 
        />
        <input 
          className="form-input" 
          name="phone" 
          placeholder="전화번호" 
          onChange={handleChange} 
        />
        
        {/* 버튼도 똑같은 파란색 버튼 적용 */}
        <button type="submit" className="btn-primary">
          가입완료
        </button>
      </form>

      {/* 뒤로가기 버튼 */}
      <button onClick={() => navigate('/login')} className="btn-link">
         로그인 화면으로 돌아가기
      </button>
    </div>
  );
};

export default SignupPage;









